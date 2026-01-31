import {
	BadRequestException,
	GoneException,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import type Redis from 'ioredis'
import * as argon2 from 'argon2'
import { REDIS } from '@/redis/redis.module'

type Purpose = 'register' | 'login' | 'reset'

@Injectable()
export class CodeService {
	constructor(@Inject(REDIS) private readonly redis: Redis) {}

	private key(email: string, purpose: Purpose) {
		return `auth:code:${purpose}:${email.toLowerCase()}`
	}
	private rlKey(email: string, purpose: Purpose) {
		return `auth:code:rl:${purpose}:${email.toLowerCase()}`
	}

	private ttlLeft(expiresAtSec: number) {
		return Math.max(1, expiresAtSec - Math.floor(Date.now() / 1000))
	}

	async issue(email: string, purpose: Purpose, code: string, ttlSec = 600) {
		if (!/^\d{6}$/.test(code))
			throw new BadRequestException('Code must be 6 digits')

		// Rate limit: 1 раз / 30с и не более 5 / час
		const per30 = await this.redis.incr(this.rlKey(email, purpose))
		if (per30 === 1) await this.redis.expire(this.rlKey(email, purpose), 30)

		const hourKey = `${this.rlKey(email, purpose)}:h`
		const perHour = await this.redis.incr(hourKey)
		if (perHour === 1) await this.redis.expire(hourKey, 3600)

		if (per30 > 1 || perHour > 5)
			throw new BadRequestException('Too many requests')

		// Хэшируем код
		const hash = await argon2.hash(code)

		const payload = JSON.stringify({
			hash,
			attemptsLeft: 5,
			expiresAt: Math.floor(Date.now() / 1000) + ttlSec
		})

		// Просто set с EX — один активный код на {email,purpose}
		await this.redis.set(this.key(email, purpose), payload, 'EX', ttlSec)
	}

	async verify(email: string, purpose: Purpose, code: string) {
		const raw = await this.redis.get(this.key(email, purpose))
		if (!raw) throw new GoneException('Code expired')

		const data = JSON.parse(raw) as {
			hash: string
			attemptsLeft: number
			expiresAt: number
		}

		if (data.expiresAt < Math.floor(Date.now() / 1000)) {
			await this.redis.del(this.key(email, purpose))
			throw new GoneException('Code expired')
		}

		const ok = await argon2.verify(data.hash, code)

		if (!ok) {
			if (data.attemptsLeft <= 1) {
				await this.redis.del(this.key(email, purpose))
				throw new BadRequestException('No attempts left')
			}
			data.attemptsLeft -= 1
			await this.redis.set(
				this.key(email, purpose),
				JSON.stringify(data),
				'EX',
				this.ttlLeft(data.expiresAt)
			)
			throw new UnauthorizedException('Invalid code')
		}

		// успех — код одноразовый
		await this.redis.del(this.key(email, purpose))
		return true
	}
}
