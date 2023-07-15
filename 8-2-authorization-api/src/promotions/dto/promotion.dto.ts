import { MaxLength, IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreatePromoDto {
	@MaxLength(100)
	title: string;

	@IsString()
	description: string;
}

export class EditPromoDto {
	@MaxLength(100)
	title: string;

	@IsString()
	description: string;

	@IsNumber()
	id: number;
}
