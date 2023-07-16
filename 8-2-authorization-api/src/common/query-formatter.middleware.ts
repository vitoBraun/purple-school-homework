import { UserService } from './../users/users.sevice';
import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { UserModel } from '@prisma/client';
import { TYPES } from '../types/types';

@injectable()
export class QueryFormatter implements IMiddleware {
	_reqQuery: any;
	_userInfo: any;
	_isAdmin: boolean;
	_queryObject: any;
	_req: any;

	private entity: any = {
		'/items': this.getItemsQuery.bind(this),
		'/promo': this.getPromoQuery.bind(this),
	};

	constructor(@inject(TYPES.UserService) private userService: UserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		this._queryObject = {};
		this._req = req;
		this._reqQuery = { ...this._req.query };

		this._userInfo = await this.userService.getUserInfo(req.user);
		this._isAdmin = this._userInfo.type === 'admin';

		this.getQueryMethodByRoute()();
		this.getBaseQuery();
		console.log(this._queryObject);

		req.query = { ...this._queryObject };

		next();
	}

	get queryObject(): any {
		return this._queryObject;
	}

	private getQueryMethodByRoute(): Function {
		const route = this._req.baseUrl;
		return this.entity[route];
	}

	private addParamsToQuery(params: any, subObject?: string): void {
		if (subObject) {
			if (!Object.prototype.hasOwnProperty.call(this._queryObject, subObject)) {
				this._queryObject[subObject] = {};
			}
			this._queryObject[subObject] = { ...this._queryObject[subObject], ...params };
			return;
		}
		this._queryObject = { ...this._queryObject, ...params };
	}

	private getItemsQuery(): void {
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
			this.addParamsToQuery(filter);
		}
		const includeCategoryField = {
			include: {
				categories: true,
			},
		};
		this.addParamsToQuery(includeCategoryField);
	}
	private getPromoQuery(): void {
		const filter: any = {
			where: { ...(!this._reqQuery.status && !this._isAdmin && { status: 'published' }) },
		};

		if (!this._isAdmin) {
			filter.where = { ...filter.where, creatorEmail: this._userInfo.email };
		}

		this.addParamsToQuery(filter.where, 'where');
	}

	private getBaseQuery(): void {
		const { page, perPage } = this._reqQuery;

		const paggination = page &&
			perPage && {
				take: perPage,
				skip: (page - 1) * perPage,
			};

		delete this._reqQuery.page;
		delete this._reqQuery.perPage;
		this.addParamsToQuery(paggination);
		this.addParamsToQuery(this._reqQuery, 'where');
	}
}
