import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CodeModule } from '@/code/code.module'
import { MailModule } from '@/email/email.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [ConfigModule, CodeModule, MailModule],
	providers: [UserService, PrismaService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
