import { inject, injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../types/types';
import { UserService } from '../users/users.sevice';

@injectable()
export class AuthGuard implements IMiddleware {
	private permissions: any = {
		'/items/create': ['admin', 'storeAdministrator'],
		'/items/edit': ['admin', 'storeAdministrator'],
		'/items/count': ['admin', 'storeAdministrator', 'storeManager'],
	};
	constructor(@inject(TYPES.UserService) private userService: UserService) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(req.user);
		const route = (req.baseUrl + req.route.path).toString();
		const allowedRoles = this.permissions[route];

		if (userInfo) {
			if (!allowedRoles) {
				return next();
			} else if (this.permissions[route] && allowedRoles.includes(userInfo.type)) {
				return next();
			}
		}

		res.status(401).send({ error: 'No permission' });
	}
}
