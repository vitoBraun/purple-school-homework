import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto, EditItemDto } from '../dto/create-Item.dto';
import { ItemsWithCategories } from './types';

export interface IItemsRepository {
	create: (item: CreateItemDto) => Promise<ItemModel>;
	createCategory: (category: string) => Promise<CategoryModel | never>;
	getCategories: () => Promise<CategoryModel[] | []>;
	getItems: () => Promise<ItemsWithCategories[] | []>;
	editItem: (item: EditItemDto) => Promise<ItemModel>;
}
