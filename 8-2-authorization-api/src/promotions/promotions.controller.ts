import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { Status, TYPES } from '../types/types';
import { ILogger } from '../logger/logger.interface';

import { IConfigService } from '../config/config.service.interface';

import { IPromoController } from './types/promotions.controller.interface';
import { AuthAdmin, AuthGuard } from '../common/auth.guard';
import { EditPromoDto } from './dto/promotion.dto';
import { IPromoService } from './types/promotions.service.interface';
import { HttpError } from '../errors/http-error.class';
import { UserService } from '../users/users.sevice';
import { QueryOptions } from './types/promotions.types';
import { QueryFormatter } from '../common/query-formatter.middleware';

@injectable()
export class PromoController extends BaseController implements IPromoController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PromoService) private promoService: IPromoService,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.QueryFormatter) private queryFormatter: QueryFormatter,
	) {
		super();
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				function: this.create,
				middleware: [new AuthGuard()],
			},
			{
				path: '/edit',
				method: 'post',
				function: this.edit,
				middleware: [new AuthGuard()],
			},
			{
				path: '/status',
				method: 'patch',
				function: this.changeStatus,
				middleware: [new AuthAdmin(this.userService)],
			},
			{
				path: '/delete',
				method: 'delete',
				function: this.delete,
				middleware: [new AuthGuard()],
			},
			{
				path: '/list',
				method: 'get',
				function: this.list,
				middleware: [new QueryFormatter(), new AuthGuard()],
			},
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { user } = req;
		const { title, description } = req.body;
		if (!title || !description) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		const result = await this.promoService.createPromo({ title, description, user });
		if (!result) {
			return next(new HttpError(422, 'Creation failed!'));
		}
		this.created(res, result);
	}

	async edit(req: Request<{}, {}, EditPromoDto>, res: Response, next: NextFunction): Promise<void> {
		const { title, description, id } = req.body;
		if (!title || !description || !id) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		const result = await this.promoService.editPromo(req.body);
		this.ok(res, result);
	}

	async changeStatus(
		req: Request<{}, {}, { id: number; status: Status }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { id, status } = req.body;
		if (!id || !status) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		const result = await this.promoService.updatePromoStatus(id, status);
		if (!result) {
			return next(new HttpError(404, 'Promo is not found'));
		}
		this.ok(res, result);
	}

	async delete(
		req: Request<{}, {}, { id: number }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { id } = req.body;
		const { user } = req;
		const isAdmin = await this.userService.validateAdmin(user);
		if (!id) {
			return next(new HttpError(422, 'Promo Id has not been provided'));
		}

		const result = await this.promoService.deletePromo(id, isAdmin ? undefined : user);
		if (!result) {
			return next(new HttpError(422, 'Promo does not exist!'));
		}
		this.send(res, 200, result);
	}

	async list(req: Request<QueryOptions, {}, { user: string }>, res: Response): Promise<void> {
		const { user } = req;
		const isAdmin = await this.userService.validateAdmin(user);
		const emailCondition = isAdmin ? undefined : user;

		const result = await this.promoService.getPromoList({
			userEmail: emailCondition,
			params: req.query,
		});
		this.ok(res, result);
	}
}
