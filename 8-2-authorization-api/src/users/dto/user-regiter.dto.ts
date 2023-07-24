import { Role } from './../../types/types';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Role } from '../../types/types';

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

	@IsOptional()
	@IsString({ message: 'Incorrect type' })
	type?: Role;
}
