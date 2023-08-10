import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';
import { UserService } from '../users/users.sevice';
import { Role } from '../types/types';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string, private userService: UserService) {}
	async execute(
		req: Request<{}, {}, { user: { name: string; email: string; type: Role } }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, async (err, payload) => {
				if (payload) {
					const email = typeof payload == 'string' ? payload : payload.email;
					req.user = await this.userService.getUserInfo(email);
					next();
				}
			});
		}
		next();
	}
}
