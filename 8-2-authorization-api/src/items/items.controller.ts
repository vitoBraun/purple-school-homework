import { ItemsService } from './items.service';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

import { IItemsController } from './types/items.controller.interface';
import { CreateItemDto, EditItemDto } from './dto/create-Item.dto';

import { ExecptionFilter } from '../errors/exeption.filter';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class ItemsController extends BaseController implements IItemsController {
	constructor(
		@inject(TYPES.ItemsService) private itemsService: ItemsService,
		@inject(TYPES.ExecptionFilter) private exeptionFilter: ExecptionFilter,
	) {
		super();

		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				function: this.create,
				middleware: [new AuthGuard(['admin', 'storeAdministrator'])],
			},
			{
				path: '/category',
				method: 'post',
				function: this.createCategory,
				middleware: [new AuthGuard(['admin', 'storeAdministrator'])],
			},
			{
				path: '/categories',
				method: 'get',
				function: this.getCategories,
				middleware: [],
			},
			{
				path: '/list',
				method: 'get',
				function: this.getItems,
				middleware: [],
			},
			{
				path: '/edit',
				method: 'patch',
				function: this.editItem,
				middleware: [new AuthGuard(['admin', 'storeAdministrator'])],
			},
			{
				path: '/count',
				method: 'patch',
				function: this.changeCount,
				middleware: [new AuthGuard(['admin', 'storeAdministrator', 'storeManager'])],
			},
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const item: CreateItemDto = req.body;
			const result = await this.itemsService.createItem(item);
			this.ok(res, result);
		} catch (error) {
			if (error instanceof Error) {
				this.exeptionFilter.catch(error, req, res, next);
			}
		}
	}
	async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { name } = req.body;
		const result = await this.itemsService.createCategory(name);
		this.ok(res, result);
	}
	async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.itemsService.getCategories();
		this.ok(res, result);
	}
	async editItem(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const itemInfo: EditItemDto = req.body;
			const result = await this.itemsService.editItem(itemInfo);
			this.ok(res, result);
		} catch (error) {
			if (error instanceof Error) {
				this.exeptionFilter.catch(error, req, res, next);
			}
		}
	}
	async changeCount(
		req: Request<{}, {}, EditItemDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const itemInfo = req.body;
		const result = await this.itemsService.editItem(itemInfo);
		this.ok(res, result);
	}
	async getItems(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.itemsService.getItems();
		this.ok(res, result);
	}
}
