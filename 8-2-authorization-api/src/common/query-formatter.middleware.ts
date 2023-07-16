import { UserService } from './../users/users.sevice';
import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { UserModel } from '@prisma/client';
import { TYPES } from '../types/types';

@injectable()
export class QueryFormatter implements IMiddleware {
	protected _queryObject: any;
	protected _reqQuery: any;
	protected _userInfo: any;
	protected _isAdmin: boolean;

	private entity: any = {
		'/items': this.itemsQuery.bind(this),
		'/promo': this.promoQuery.bind(this),
	};

	constructor(@inject(TYPES.UserService) private userService: UserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		this._reqQuery = { ...req.query };
		this._userInfo = await this.userService.getUserInfo(req.user);
		this._isAdmin = this._userInfo.type === 'admin';

		const route = req.baseUrl;

		this.entity[route]();
		this.commonQuery();

		req.query = { ...this._queryObject };

		next();
	}

	get queryObject(): any {
		return this._queryObject;
	}

	private itemsQuery(): void {
		const { category } = this._reqQuery;
		if (category) {
			const filter = {
				where: {
					categories: {
						some: {
							name: category,
						},
					},
				},
			};
			delete this._reqQuery.category;
			this._queryObject = { ...this._queryObject, ...filter };
		}
		const addCategoryField = {
			include: {
				categories: true,
			},
		};
		this._queryObject = { ...this._queryObject, ...addCategoryField };
	}
	private promoQuery(): void {
		const filter = {
			where: { ...(!this._reqQuery.status && !this._isAdmin && { status: 'published' }) },
		};
		this._queryObject = { ...this._queryObject, ...filter };
		if (!this._isAdmin) {
			filter.where = { ...this._queryObject.where, creatorEmail: this._userInfo.email };
		}
		this._queryObject.where = { ...this._queryObject.where, ...filter.where };
	}

	private commonQuery(): void {
		const { page, perPage } = this._reqQuery;

		const paggination = page &&
			perPage && {
				take: perPage,
				skip: (page - 1) * perPage,
			};

		delete this._reqQuery.page;
		delete this._reqQuery.perPage;

		this._queryObject.where = { ...this._queryObject.where, ...this._reqQuery };

		this._queryObject = { ...this._queryObject, ...paggination };
		console.log(this._queryObject);
	}
}
