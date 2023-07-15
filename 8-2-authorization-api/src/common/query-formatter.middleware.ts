import { Response, Request, NextFunction } from 'express';
import { injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';

@injectable()
export class QueryFormatter implements IMiddleware {
	protected _queryObject: any;
	protected _reqQuery: any;

	private entity: any = {
		'/items': this.itemsQuery.bind(this),
		'/promo': this.promoQuery.bind(this),
	};

	execute(req: Request, res: Response, next: NextFunction): void {
		this._reqQuery = { ...req.query };

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
			where: { ...(!this._reqQuery.status && { status: 'published' }) },
		};
		this._queryObject = { ...this._queryObject, ...filter };
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

		if (Object.keys(this._reqQuery).length !== 0) {
			this._queryObject.where = { ...this._reqQuery };
		}

		this._queryObject = { ...this._queryObject, ...paggination };
	}
}
