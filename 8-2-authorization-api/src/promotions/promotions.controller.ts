import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { ILogger } from '../logger/logger.interface';

import { IConfigService } from '../config/config.service.interface';

import { IPromoController } from './types/promotions.controller.interface';
import { AuthGuard } from '../common/auth.guard';
import { CreatePromoDto, EditPromoDto } from './dto/promotion.dto';
import { IPromoService } from './types/promotions.service.interface';
import { HttpError } from '../errors/http-error.class';
import { IUserService } from '../users/types/users.sevice.interface';

@injectable()
export class PromoController extends BaseController implements IPromoController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PromoService) private promoService: IPromoService,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);
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
				path: '/delete',
				method: 'delete',
				function: this.delete,
				middleware: [new AuthGuard()],
			},
			{
				path: '/list',
				method: 'get',
				function: this.list,
				middleware: [new AuthGuard()],
			},
		]);
	}

	async create(
		req: Request<{}, {}, CreatePromoDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { user } = req;
		const { title, description } = req.body;
		if (!title || !description) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		const result = await this.promoService.createPromo({ title, description, creatorEmail: user });
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

	async list(req: Request<{}, {}, { user: string }>, res: Response): Promise<void> {
		const { user } = req;
		const isAdmin = await this.userService.validateAdmin(user);

		const result = await this.promoService.getPromoList(isAdmin ? undefined : user);
		this.ok(res, result);
	}
}
