import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
export const REDIS = Symbol('REDIS')

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: REDIS,
			useFactory: (cfg: ConfigService) => {
				// 1) если есть REDIS_URL — используем её
				const url = cfg.get<string>('REDIS_URL')
				if (url) return new Redis(url)

				// 2) иначе собираем по полям
				const host = cfg.get<string>('REDIS_HOST', '127.0.0.1')
				const port = Number(cfg.get<string>('REDIS_PORT', '6379'))
				const password = cfg.get<string>('REDIS_PASSWORD')
				const db = Number(cfg.get<string>('REDIS_DB', '0'))
				return new Redis({ host, port, password, db, lazyConnect: false })
			},
			inject: [ConfigService]
		}
	],
	exports: [REDIS]
})
export class RedisModule {}
