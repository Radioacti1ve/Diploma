import { PrismaService } from '@/prisma.service'
import { UserModule } from '@/user/user.module'
import { UserService } from '@/user/user.service'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJWTConfig } from 'src/config/jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenService } from './refresh-token.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RedisModule } from '@/redis/redis.module'
import { MailModule } from '@/email/email.module'

@Module({
	controllers: [AuthController],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		}),
		UserModule,
		RedisModule,
		MailModule
	],
	providers: [
		AuthService,
		JwtStrategy,
		PrismaService,
		UserService,
		RefreshTokenService
	]
})
export class AuthModule {}
