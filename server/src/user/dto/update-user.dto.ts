import { Type } from 'class-transformer'
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateChannelDto {
	@IsString()
	slug: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	avatarUrl?: string

	@IsOptional()
	@IsString()
	bannerUrl?: string
}

export class UpdateChannelDto {
	@IsOptional()
	@IsString()
	slug?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	avatarUrl?: string

	@IsOptional()
	@IsString()
	bannerUrl?: string
}

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateChannelDto)
	channel?: UpdateChannelDto
}
