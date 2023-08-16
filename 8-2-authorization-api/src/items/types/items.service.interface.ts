import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto, EditItemDto } from '../dto/create-Item.dto';

export interface IItemsService {
	createItem: (dto: CreateItemDto) => Promise<ItemModel>;
	createCategory: (category: string) => Promise<CategoryModel | never>;
	getCategories: () => Promise<CategoryModel[] | []>;
	getItems: () => Promise<CategoryModel[] | []>;
	editItem: (dto: EditItemDto) => Promise<ItemModel>;
}
