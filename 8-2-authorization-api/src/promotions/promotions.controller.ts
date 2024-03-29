import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import { Status, TYPES, statusNames } from '../types/types';

import { IPromoController } from './types/promotions.controller.interface';
import { AuthGuard } from '../common/auth.guard';
import { EditPromoDto } from './dto/promotion.dto';
import { IPromoService } from './types/promotions.service.interface';
import { HttpError } from '../errors/http-error.class';
import { UserService } from '../users/users.sevice';

@injectable()
export class PromoController extends BaseController implements IPromoController {
	constructor(
		@inject(TYPES.PromoService) private promoService: IPromoService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super();
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				function: this.create,
				middleware: [new AuthGuard(['provider', 'storeAdministrator'])],
			},
			{
				path: '/edit',
				method: 'post',
				function: this.edit,
				middleware: [new AuthGuard(['storeAdministrator'])],
			},
			{
				path: '/status',
				method: 'patch',
				function: this.changeStatus,
				middleware: [new AuthGuard(['storeAdministrator'])],
			},
			{
				path: '/delete',
				method: 'delete',
				function: this.delete,
				middleware: [new AuthGuard(['storeAdministrator'])],
			},
			{
				path: '/list',
				method: 'get',
				function: this.list,
				middleware: [new AuthGuard(['provider', 'storeAdministrator'])],
			},
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await req.user;
		const { title, description } = req.body;
		if (!title || !description) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		try {
			const result = await this.promoService.createPromo({ title, description, user });

			if (!result) {
				return next(new HttpError(422, 'Creation failed!'));
			}
			this.created(res, result);
		} catch (error: any) {
			return next(new HttpError(422, error.message));
		}
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
		const inValidRequest = !id || !status || !Object.keys(statusNames).includes(status);
		if (inValidRequest) {
			return next(new HttpError(422, 'Promo Id or status is incorrect'));
		}
		const result = await this.promoService.updatePromoStatus(id, status);
		if (!result) {
			return next(new HttpError(404, 'Promo is not found'));
		}
		this.ok(res, result);
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.body;
		const user = await req.user;
		const isAdmin = user.type === 'admin';
		if (!id) {
			return next(new HttpError(422, 'Promo Id has not been provided'));
		}

		const result = await this.promoService.deletePromo(id, isAdmin ? undefined : user.email);
		if (!result) {
			return next(new HttpError(422, 'Promo does not exist!'));
		}
		this.send(res, 200, result);
	}

	async list(req: Request, res: Response): Promise<void> {
		const user = await req.user;

		const result = await this.promoService.getPromoList({
			user,
		});
		this.ok(res, result);
	}
}
