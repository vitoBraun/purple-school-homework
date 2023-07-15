import { IMiddleware, Middleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'User not logged in' });
	}
}

export class AuthAdmin extends Middleware {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.userServ.getUserInfo(req.user);
		if (user?.type === 'admin') {
			return next();
		}

		res.status(401).send({ error: 'User is not admin' });
	}
}
