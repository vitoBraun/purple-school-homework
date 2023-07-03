import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UserRegisterDto {
	@MaxLength(100)
	@IsEmail({}, { message: 'Incorrect email address' })
	email: string;

	@MaxLength(100)
	@IsString({ message: 'Incorrect password' })
	password: string;

	@MaxLength(150)
	@IsString({ message: 'Incorrect name' })
	name: string;
}
