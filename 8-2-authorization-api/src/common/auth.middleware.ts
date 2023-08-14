import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';
import { UserService } from '../users/users.sevice';
import { Role } from '../types/types';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string, private userService: UserService) {}
	execute(
		req: Request<{}, {}, { user: { name: string; email: string; type: Role } }>,
		res: Response,
		next: NextFunction,
	): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (payload) {
					const email = typeof payload == 'string' ? payload : payload.email;
					req.user = this.userService.getUserInfo(email);
					next();
				}
			});
		}
		//next();
	}
}
