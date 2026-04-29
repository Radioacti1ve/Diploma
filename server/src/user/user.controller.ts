import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'

import { User } from '@prisma/client'
import { CurrentUser } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Post('profile/send-verification-code')
	@HttpCode(200)
	@Auth()
	async sendVerificationCode(@CurrentUser('id') id: string) {
		return this.userService.sendVerificationCode(id)
	}

	@Post('profile/verify-email-code')
	@HttpCode(200)
	@Auth()
	async verifyEmailCode(
		@CurrentUser('id') id: string,
		@Body('code') code: string
	) {
		return this.userService.verifyEmailCode(id, code)
	}

	@Put('profile/likes')
	@HttpCode(200)
	@Auth()
	async toggleLike(
		@Body('videoId') videoId: string,
		@CurrentUser() user: User
	) {
		return this.userService.toggleLike(videoId, user.id)
	}
}
