import { ItemsService } from './items.service';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { ILogger } from '../logger/logger.interface';

import { IConfigService } from '../config/config.service.interface';

import { IItemsController } from './types/items.controller.interface';
import { UserService } from '../users/users.sevice';
import { CreateItemDto } from './dto/create-Item.dto';

import { ExecptionFilter } from '../errors/exeption.filter';
import { QueryFormatter } from '../common/query-formatter.middleware';

@injectable()
export class ItemsController extends BaseController implements IItemsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ItemsService) private itemsService: ItemsService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ExecptionFilter) private exeptionFilter: ExecptionFilter,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				function: this.create,
				middleware: [],
			},
			{
				path: '/category',
				method: 'post',
				function: this.createCategory,
				middleware: [],
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
				middleware: [new QueryFormatter()],
			},
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const item: CreateItemDto = req.body;
			const result = await this.itemsService.createItem(item);
			this.ok(res, result);
		} catch (error: any) {
			this.exeptionFilter.catch(error, req, res, next);
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
	async getItems(req: Request, res: Response, next: NextFunction): Promise<void> {
		const params = req.query;
		const result = await this.itemsService.getItems(params);
		this.ok(res, result);
	}
}
