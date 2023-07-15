import { MaxLength, IsString, IsNumber, IsEmail } from 'class-validator';

export class CreatePromoDto {
	@MaxLength(100)
	title: string;

	@IsString()
	description: string;

	@IsEmail()
	creatorEmail: string;
}

export class EditPromoDto {
	@MaxLength(100)
	title: string;

	@IsString()
	description: string;

	@IsNumber()
	id: number;
}
