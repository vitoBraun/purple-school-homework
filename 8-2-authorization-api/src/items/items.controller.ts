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

import { HttpError } from '../errors/http-error.class';

@injectable()
export class ItemsController extends BaseController implements IItemsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ItemsService) private itemsService: ItemsService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
				middleware: [],
			},
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		const item: CreateItemDto = req.body;
		const result = await this.itemsService.createItem(item);
		if (!result) {
			return next(new HttpError(500, 'Could not add item', 'login'));
		}
		this.ok(res, result);
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
		const { category } = req.query;
		const result = await this.itemsService.getItems(category as string);
		this.ok(res, result);
	}
}
