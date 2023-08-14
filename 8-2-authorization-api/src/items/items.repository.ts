import { inject, injectable } from 'inversify';
import { IItemsRepository } from './types/items.repository.interface';

import { CategoryModel, ItemModel } from '@prisma/client';

import { TYPES } from '../types/types';
import { PrismaService } from '../database/prisma.service';
import { CreateItemDto, EditItemDto } from './dto/create-Item.dto';

import { ItemsWithCategories } from './types/types';

@injectable()
export class ItemsRepository implements IItemsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(item: CreateItemDto): Promise<ItemModel> {
		// const categories = await this.prismaService.client.categoryModel.findMany({
		// 	where: { id: { in: item.categories } },
		// });
		// if (!categories.length) {
		// 	throw new Error('Category not exists');
		// }

		return await this.prismaService.client.itemModel.create({
			data: {
				name: item.name,
				description: item.description,
				price: item.price,
				storeCount: item.storeCount,
				categories: {
					connect: item.categories.map((categoryId) => ({ id: categoryId })),
				},
			},
			include: {
				categories: true,
			},
		});
	}

	async createCategory(name: string): Promise<CategoryModel | never> {
		return await this.prismaService.client.categoryModel.create({
			data: {
				name,
			},
		});
	}
	async getCategories(): Promise<CategoryModel[] | []> {
		return await this.prismaService.client.categoryModel.findMany();
	}
	async editItem(itemInfo: EditItemDto): Promise<ItemModel> {
		// const categories = await this.prismaService.client.categoryModel.findMany({
		// 	where: { name: { in: itemInfo.categories } },
		// });

		// if (categories.length === 0) {
		// 	throw new Error('Category not exist');
		// }
		const data = {
			...itemInfo,
			...(itemInfo.categories && {
				categories: { set: itemInfo.categories.map((categoryId) => ({ id: categoryId })) },
			}),
		};
		return await this.prismaService.client.itemModel.update({
			where: { id: itemInfo.id },
			data,
			include: {
				categories: true,
			},
		});
	}

	async getItems(): Promise<ItemsWithCategories[] | []> {
		return await this.prismaService.client.itemModel.findMany({
			include: {
				categories: true,
			},
		});
	}
}
