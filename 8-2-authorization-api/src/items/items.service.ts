import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types/types';
import { IItemsRepository } from './types/items.repository.interface';
import { IItemsService } from './types/items.service.interface';
import { CategoryModel, ItemModel } from '@prisma/client';
import { CreateItemDto, EditItemDto } from './dto/create-Item.dto';
import { ExecptionFilter } from '../errors/exeption.filter';
import { Request } from 'express';
import { AuthGuard } from '../common/auth.guard';
@injectable()
export class ItemsService implements IItemsService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ItemsRepository) private itemsRepository: IItemsRepository,
		@inject(TYPES.ExecptionFilter) private exeptionFilter: ExecptionFilter,
	) {}
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
