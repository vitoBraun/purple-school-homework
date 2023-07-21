import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { UserService } from '../users/users.sevice';
import { TYPES } from '../types/types';

@injectable()
export class QueryFormatter implements IMiddleware {
	_reqQuery: any;
	_userInfo: any;
	_isAdmin: boolean;
	_queryObject: any;

	private methodsByRoute: any = {
		'/items': this.addItemsParams.bind(this),
		'/promo': this.addPromoParams.bind(this),
	};
	constructor(@inject(TYPES.UserService) private userService: UserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		this._queryObject = {};
		this._reqQuery = { ...req.query };

		this._userInfo = await this.userService.getUserInfo(req.user);
		this._isAdmin = this._userInfo.type === 'admin';

		const route = req.baseUrl;
		this.methodsByRoute[route]();
		this.addBaseParams();

		req.query = { ...this._queryObject };

		next();
	}

	private mutateQueryObject(params: any, subObject?: string): void {
		if (subObject) {
			if (!Object.prototype.hasOwnProperty.call(this._queryObject, subObject)) {
				this._queryObject[subObject] = {};
			}
			this._queryObject[subObject] = { ...this._queryObject[subObject], ...params };
			return;
		}
		this._queryObject = { ...this._queryObject, ...params };
	}

	private addItemsParams(): void {
		const baseParams = {
			include: {
				categories: true,
			},
			where: {
				storeCount: {
					gt: 0,
				},
			},
		};

		this.mutateQueryObject(baseParams);
		if (this._reqQuery.all) {
			this.mutateQueryObject({ storeCount: undefined }, 'where');
			delete this._reqQuery.all;
		}

		const { category } = this._reqQuery;
		if (category) {
			const byCategory = {
				where: {
					categories: {
						some: {
							name: category,
						},
					},
				},
			};
			delete this._reqQuery.category;
			this.mutateQueryObject(byCategory.where, 'where');
		}
	}
	private addPromoParams(): void {
		const filter: any = {
			where: { ...(!this._reqQuery.status && !this._isAdmin && { status: 'published' }) },
		};

		if (!this._isAdmin) {
			filter.where = { ...filter.where, creatorEmail: this._userInfo.email };
		}

		this.mutateQueryObject(filter.where, 'where');
	}

	private addBaseParams(): void {
		const { page, perPage } = this._reqQuery;

		const paggination = page &&
			perPage && {
				take: perPage,
				skip: (page - 1) * perPage,
			};

		delete this._reqQuery.page;
		delete this._reqQuery.perPage;

		this.mutateQueryObject(paggination);
		this.mutateQueryObject(this._reqQuery, 'where');
	}
}
