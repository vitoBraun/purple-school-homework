import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto } from '../dto/create-Item.dto';
import { Request } from 'express';
export interface IItemsService {
	createItem: (dto: CreateItemDto) => Promise<ItemModel>;
	createCategory: (category: string) => Promise<CategoryModel | never>;
	getCategories: () => Promise<CategoryModel[] | []>;
	getItems: (params: Request['query']) => Promise<CategoryModel[] | []>;
}
