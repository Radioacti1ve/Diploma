import { PrismaService } from '@/prisma.service'
import { CodeService } from '@/code/code.service'
import { MailService } from '@/email/email.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { omit } from 'lodash'
import { UpdateUserDto } from './dto/update-user.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly codeService: CodeService,
		private readonly mailService: MailService
	) {}

	async byId(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				likes: {
					include: {
						video: {
							include: {
								channel: {
									include: {
										user: true
									}
								}
							}
						}
					}
				},
				channel: true,
				subscriptions: true
			}
		})
		if (!user) throw new NotFoundException('User not found')

		return omit(user, ['password'])
	}

	async getProfile(id: string) {
		const user = await this.byId(id)

		const subscribedVideos = await this.prisma.video.findMany({
			where: {
				channel: {
					subscribers: {
						some: {
							id: id
						}
					}
				}
			},
			include: {
				channel: {
					include: {
						user: true
					}
				},
				likes: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return {
			...user,
			subscribedVideos
		}
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { id },
			include: {
				channel: true
			}
		})

		if (!existingUser) {
			throw new NotFoundException('User not found')
		}

		if (dto.email) {
			const userWithSameEmail = await this.prisma.user.findUnique({
				where: { email: dto.email }
			})

			if (userWithSameEmail && userWithSameEmail.id !== id) {
				throw new BadRequestException('Email busy')
			}
		}

		const data: Prisma.UserUpdateInput = {}

		if (dto.name !== undefined) {
			data.name = dto.name
		}

		if (dto.email !== undefined) {
			data.email = dto.email
		}

		if (dto.password) {
			data.password = await hash(dto.password)
		}

		if (dto.channel) {
			if (!existingUser.channel && !dto.channel.slug) {
				throw new BadRequestException(
					'channel.slug is required when creating a channel'
				)
			}

			data.channel = {
				upsert: {
					create: {
						slug: dto.channel.slug!,
						description: dto.channel.description ?? null,
						avatarUrl: dto.channel.avatarUrl ?? null,
						bannerUrl: dto.channel.bannerUrl ?? null
					},
					update: {
						...(dto.channel.slug !== undefined && { slug: dto.channel.slug }),
						...(dto.channel.description !== undefined && {
							description: dto.channel.description
						}),
						...(dto.channel.avatarUrl !== undefined && {
							avatarUrl: dto.channel.avatarUrl
						}),
						...(dto.channel.bannerUrl !== undefined && {
							bannerUrl: dto.channel.bannerUrl
						})
					}
				}
			}
		}

		return this.prisma.user.update({
			where: { id },
			data,
			include: {
				channel: true
			}
		})
	}

	async sendVerificationCode(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (!user) throw new NotFoundException('User not found')

		if (!user.verificationToken) {
			return true
		}

		const code = String(Math.floor(100000 + Math.random() * 900000))

		await this.codeService.issue(user.email, 'register', code, 600)
		await this.mailService.sendConfirmCode(user.email, code)

		return true
	}

	async verifyEmailCode(id: string, code: string) {
		if (!/^\d{6}$/.test(code)) {
			throw new BadRequestException('Code must be 6 digits')
		}

		const user = await this.prisma.user.findUnique({
			where: { id }
		})

		if (!user) throw new NotFoundException('User not found')

		if (!user.verificationToken) {
			return true
		}

		await this.codeService.verify(user.email, 'register', code)

		await this.prisma.user.update({
			where: { id },
			data: {
				verificationToken: null
			}
		})

		return true
	}

	async getCount() {
		return this.prisma.user.count()
	}

	async getAll(searchTerm?: string) {
		return this.prisma.user.findMany({
			where: searchTerm
				? {
						email: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				: {},
			select: {
				email: true,
				createdAt: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async delete(id: string) {
		return this.prisma.user.delete({
			where: { id }
		})
	}

	async toggleLike(videoId: string, userId: string) {
		const videoExists = await this.prisma.video.findUnique({
			where: { id: videoId }
		})

		if (!videoExists) {
			throw new Error('Видео не найдено')
		}

		const isLiked = await this.prisma.videoLike.findFirst({
			where: {
				userId: userId,
				videoId: videoId
			}
		})

		if (isLiked) {
			return this.prisma.videoLike.delete({
				where: {
					id: isLiked.id
				}
			})
		}

		return this.prisma.videoLike.create({
			data: {
				userId: userId,
				videoId: videoId
			}
		})
	}
}
