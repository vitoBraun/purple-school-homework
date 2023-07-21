import { MaxLength } from 'class-validator';

export class CreateItemDto {
	@MaxLength(100)
	name: string;

	description: string;

	@MaxLength(50)
	price: number;

	@MaxLength(50)
	storeCount: number;

	categories: string[];
}

export class EditItemDto {
	id: number;

	@MaxLength(100)
	name: string;

	description: string;

	@MaxLength(50)
	price: number;

	@MaxLength(50)
	storeCount: number;

	categories: string[];
}
