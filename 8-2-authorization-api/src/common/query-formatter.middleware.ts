import { Response, Request, NextFunction } from 'express';
import { injectable } from 'inversify';
import { Middleware } from './middleware.interface';

@injectable()
export class QueryFormatter extends Middleware {
	_reqQuery: any;
	_userInfo: any;
	_isAdmin: boolean;
	_queryObject: any;
	_req: any;

	private methodsByRoute: any = {
		'/items': this.addItemsParams.bind(this),
		'/promo': this.addPromoParams.bind(this),
	};

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		this._queryObject = {};
		this._req = req;
		this._reqQuery = { ...this._req.query };

		this._userInfo = await this.userServ.getUserInfo(req.user);
		this._isAdmin = this._userInfo.type === 'admin';

		const route = this._req.baseUrl;
		this.methodsByRoute[route]();
		this.addBaseParams();

		req.query = { ...this._queryObject };

		next();
	}

	get queryObject(): any {
		return this._queryObject;
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
			this.mutateQueryObject(filter);
		}
		const includeCategoryField = {
			include: {
				categories: true,
			},
		};
		this.mutateQueryObject(includeCategoryField);
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
