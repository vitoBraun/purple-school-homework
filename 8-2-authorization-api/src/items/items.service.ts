import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types/types';
import { IItemsRepository } from './types/items.repository.interface';
import { IItemsService } from './types/items.service.interface';
import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto } from './dto/create-Item.dto';

@injectable()
export class ItemsService implements IItemsService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ItemsRepository) private itemsRepository: IItemsRepository,
	) {}
	async createItem(item: CreateItemDto): Promise<ItemModel | null> {
		return await this.itemsRepository.create(item);
	}
	async createCategory(name: string): Promise<CategoryModel | null> {
		return await this.itemsRepository.createCategory(name);
	}
	async getCategories(): Promise<CategoryModel[] | null> {
		return await this.itemsRepository.getCategories();
	}
	async getItems(category?: string): Promise<ItemModel[] | null> {
		return await this.itemsRepository.getItems(category);
	}
}
