import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';
import { HttpError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './types/users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-regiter.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthAdmin, AuthGuard } from '../common/auth.guard';
import { UserService } from './users.sevice';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				function: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				function: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/delete',
				method: 'delete',
				function: this.delete,
				middleware: [new AuthAdmin(this.userService)],
			},
			{
				path: '/info',
				method: 'get',
				function: this.info,
				middleware: [new AuthGuard()],
			},
			{
				path: '/list',
				method: 'get',
				function: this.list,
				middleware: [new AuthAdmin(this.userService)],
			},
			{
				path: '/password',
				method: 'post',
				function: this.changePassword,
				middleware: [new AuthAdmin(this.userService)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { body } = req;
		const result = await this.userService.validateUser(body);

		if (!result) {
			return next(new HttpError(401, 'Invalid credentials', 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));

		this.ok(res, { jwt });
	}
	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'The user is already existing'));
		}
		this.ok(res, { email: result.email, id: result.id, type: result.type });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id, type: userInfo?.type });
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { email } = req.body;
		const result = await this.userService.deleteUser(email);
		if (!result) {
			return next(new HttpError(422, 'The user is not existing'));
		}
		this.send(res, 200, result);
	}

	async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		const isAdmin = await this.userService.validateAdmin(req.user);
		if (!isAdmin) {
			return next(new HttpError(403, 'You do not have permission'));
		}
		const { email, newPassword } = req.body;
		if (!email || !newPassword) {
			return next(new HttpError(422, 'Incorrect data'));
		}
		const result = await this.userService.changeUserPassword(email, newPassword);
		this.ok(res, result);
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.getUsersList();
		this.ok(res, result);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
