import { CategoryModel, ItemModel } from '@prisma/client';

export interface ItemsWithCategories extends ItemModel {
	categories?: CategoryModel[];
}
