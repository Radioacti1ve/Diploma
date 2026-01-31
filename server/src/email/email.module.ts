import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { MailService } from './email.service'
import { RESEND } from './email.tokens'

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: RESEND,
			useFactory: (config: ConfigService) =>
				new Resend(config.get<string>('RESEND_API_KEY')!),
			inject: [ConfigService]
		},
		MailService
	],
	exports: [MailService]
})
export class MailModule {}
