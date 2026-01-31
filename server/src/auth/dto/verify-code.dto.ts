import { IsEmail, IsIn, Length, Matches } from 'class-validator'
export class VerifyCodeDto {
	@IsEmail() email!: string
	@IsIn(['register', 'login', 'reset']) purpose!: 'register' | 'login' | 'reset'
	@Length(6, 6) @Matches(/^\d{6}$/) code!: string
}
