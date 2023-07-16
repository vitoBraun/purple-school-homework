import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { UserService } from '../users/users.sevice';

import { TYPES } from '../types/types';

export interface IMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}

@injectable()
export class Middleware implements IMiddleware {
	public userServ: UserService;
	constructor(@inject(TYPES.UserService) private userService: UserService) {
		this.userServ = userService;
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		return;
	}
}
