import { Router, Response } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
export { Router } from 'express';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}
	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message?: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public created<T>(res: Response, message?: T): ExpressReturnType {
		return this.send<T>(res, 201, message);
	}

	public deleted<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 204, message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(route.path);
			const middlware = route.middleware?.map((m) => m.execute.bind(m));
			const handler = route.function.bind(this);
			const pipeline = middlware ? [...middlware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
