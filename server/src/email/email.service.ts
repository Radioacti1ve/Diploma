import {
	Inject,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { RESEND } from './email.tokens'

@Injectable()
export class MailService {
	constructor(
		@Inject(RESEND) private readonly resend: Resend,
		private readonly config: ConfigService
	) {}

	async sendConfirmCode(email: string, code: string) {
		const from =
			this.config.get<string>('RESEND_FROM') || 'Auth <onboarding@resend.dev>'

		const { data, error } = await this.resend.emails.send({
			from,
			to: email,
			subject: 'Your confirmation code',
			// Можно вынести в шаблон, тут — минимализм
			html: `
        <div style="font-family:Arial,sans-serif">
          <p>Your confirmation code:</p>
          <p style="font-size:24px;font-weight:700;letter-spacing:2px">${code}</p>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
		})

		if (error) {
			// Подними в логах error.name/ message/ statusCode из Resend
			throw new InternalServerErrorException(error)
		}
		return data // { id: '...' }
	}
}
