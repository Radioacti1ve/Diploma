// src/auth/code.module.ts
import { Module } from '@nestjs/common'
import { CodeService } from './code.service'
import { CodeController } from './code.controller'
import { RedisModule } from '@/redis/redis.module'
import { MailModule } from '@/email/email.module'

@Module({
	imports: [RedisModule, MailModule],
	providers: [CodeService],
	controllers: [CodeController]
})
export class CodeModule {}
