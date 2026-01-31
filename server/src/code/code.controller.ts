// src/auth/code.controller.ts
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { CodeService } from './code.service'
import { MailService } from '@/email/email.service'
import { SendCodeDto } from '@/auth/dto/send-code.dto'
import { VerifyCodeDto } from '@/auth/dto/verify-code.dto'

@Controller('auth')
export class CodeController {
	constructor(
		private readonly codes: CodeService,
		private readonly mail: MailService
	) {}

	@Post('send-code')
	@HttpCode(204)
	async send(@Body() dto: SendCodeDto) {
		const code = String(Math.floor(100000 + Math.random() * 900000))
		await this.codes.issue(dto.email, dto.purpose, code, 600) // 10 минут
		await this.mail.sendConfirmCode(dto.email, code) // Resend
		return { ok: true }
	}

	@Post('verify-code')
	async verify(@Body() dto: VerifyCodeDto) {
		await this.codes.verify(dto.email, dto.purpose, dto.code)

		// Тут твоя бизнес-логика:
		// - register: пометить email verified, создать юзера
		// - login: выдать access/refresh токены
		// - reset: разрешить смену пароля
		return { ok: true }
	}
}
