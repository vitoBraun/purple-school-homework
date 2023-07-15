import { inject, injectable } from 'inversify';
import { IItemsRepository } from './types/items.repository.interface';

import { CategoryModel, ItemModel } from '@prisma/client';

import { TYPES } from '../types/types';
import { PrismaService } from '../database/prisma.service';
import { CreateItemDto } from './dto/create-Item.dto';
import { Request } from 'express';
import { ItemsWithCategories } from './types/types';
import { QueryFormatter } from '../common/query-formatter.middleware';

@injectable()
export class ItemsRepository implements IItemsRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.QueryFormatter) private queryFormatter: QueryFormatter,
	) {}

	async create(item: CreateItemDto): Promise<ItemModel> {
		const categories = await this.prismaService.client.categoryModel.findMany({
			where: { name: { in: item.categories } },
		});
		if (categories.length === 0) {
			await this.createCategory(item.categories[0]);
			throw new Error('Category not exist, and was created');
		}

		const newItem = await this.prismaService.client.itemModel.create({
			data: {
				name: item.name,
				description: item.description,
				price: item.price,
				storeCount: item.storeCount,
				categories: { connect: categories.map((category) => ({ id: category.id })) },
			},
			include: {
				categories: true,
			},
		});
		return newItem;
	}

	async createCategory(name: string): Promise<CategoryModel | never> {
		const newItem = await this.prismaService.client.categoryModel.create({
			data: {
				name,
			},
		});
		return newItem;
	}
	async getCategories(): Promise<CategoryModel[] | []> {
		const categories = await this.prismaService.client.categoryModel.findMany();
		return categories;
	}

	async getItems(params: any): Promise<ItemsWithCategories[] | []> {
		const items = await this.prismaService.client.itemModel.findMany(params);
		return items;
	}
}