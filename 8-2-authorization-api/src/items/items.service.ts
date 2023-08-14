import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { IItemsRepository } from './types/items.repository.interface';
import { IItemsService } from './types/items.service.interface';
import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto, EditItemDto } from './dto/create-Item.dto';
import { Request } from 'express';
@injectable()
export class ItemsService implements IItemsService {
	constructor(@inject(TYPES.ItemsRepository) private itemsRepository: IItemsRepository) {}
	async createItem(item: CreateItemDto): Promise<ItemModel> {
		return await this.itemsRepository.create(item);
	}
	async createCategory(name: string): Promise<CategoryModel | never> {
		return await this.itemsRepository.createCategory(name);
	}
	async getCategories(): Promise<CategoryModel[] | []> {
		return await this.itemsRepository.getCategories();
	}
	async getItems(params: Request['query']): Promise<ItemModel[] | []> {
		return await this.itemsRepository.getItems(params);
	}
	async editItem(itemInfo: EditItemDto): Promise<ItemModel> {
		return await this.itemsRepository.editItem(itemInfo);
	}
}
