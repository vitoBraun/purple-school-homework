import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto } from '../dto/create-Item.dto';

export interface IItemsService {
	createItem: (dto: CreateItemDto) => Promise<ItemModel | null>;
	createCategory: (category: string) => Promise<CategoryModel | null>;
	getCategories: () => Promise<CategoryModel[] | null>;
	getItems: (category?: string) => Promise<CategoryModel[] | null>;
}
