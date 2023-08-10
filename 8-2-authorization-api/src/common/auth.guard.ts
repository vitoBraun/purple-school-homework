import { injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../types/types';

@injectable()
export class AuthGuard implements IMiddleware {
	constructor(private allowedRoles: Role[] | 'allRoles') {}

	execute(req: Request, res: Response, next: NextFunction): void {
		console.log(req.user);
		if (req.user) {
			if (this.allowedRoles === 'allRoles') {
				next();
			} else if (this.allowedRoles.includes(req.user.type)) {
				next();
			}
		}

		res.status(401).send({ error: 'No permission' });
	}
}
