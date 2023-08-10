import { inject, injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { Role, TYPES } from '../types/types';
import { UserService } from '../users/users.sevice';

@injectable()
export class AuthGuard implements IMiddleware {
	constructor(private allowedRoles: Role[] | 'allRoles') {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (this.allowedRoles === 'allRoles') {
			return next();
		} else if (this.allowedRoles.includes(req.user.type)) {
			return next();
		}

		res.status(401).send({ error: 'No permission' });
	}
}
