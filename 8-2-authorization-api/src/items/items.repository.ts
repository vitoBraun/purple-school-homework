import { inject, injectable } from 'inversify';
import { IItemsRepository } from './types/items.repository.interface';

import { CategoryModel, ItemModel } from '@prisma/client';

import { TYPES } from '../types/types';
import { PrismaService } from '../database/prisma.service';
import { CreateItemDto } from './dto/create-Item.dto';

@injectable()
export class ItemsRepository implements IItemsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(item: CreateItemDto): Promise<ItemModel | null> {
		const categories = await this.prismaService.client.categoryModel.findMany({
			where: { name: { in: item.categories } },
		});
		if (categories.length === 0) {
			return null;
		}

		const newItem = await this.prismaService.client.itemModel.create({
			data: {
				name: item.name,
				description: item.description,
				price: item.price,
				storeCount: item.storeCount,
				categories: { connect: categories.map((category) => ({ id: category.id })) },
			},
		});
		return newItem;
	}

	async createCategory(name: string): Promise<CategoryModel | null> {
		const newItem = await this.prismaService.client.categoryModel.create({
			data: {
				name,
			},
		});
		return newItem;
	}
	async getCategories(): Promise<CategoryModel[] | null> {
		const categories = await this.prismaService.client.categoryModel.findMany();
		return categories;
	}
	async getItems(category?: string): Promise<ItemModel[] | null> {
		const query = {
			where: {
				categories: {
					some: {
						name: category,
					},
				},
			},
		};
		const items = await this.prismaService.client.itemModel.findMany(category ? query : undefined);
		return items;
	}
}
