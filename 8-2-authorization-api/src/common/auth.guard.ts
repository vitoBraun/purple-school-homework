import { injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../types/types';

@injectable()
export class AuthGuard implements IMiddleware {
	constructor(private allowedRoles: Role[] | 'allRoles') {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await req.user;
		if (user) {
			if (this.allowedRoles === 'allRoles') {
				next();
			} else if (this.allowedRoles.includes(user.type)) {
				next();
			} else {
				res.status(401).send({ error: 'No permission' });
			}
		} else {
			res.status(401).send({ error: 'No permission' });
		}
	}
}
