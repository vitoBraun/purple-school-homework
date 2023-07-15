import { PromoController } from './promotions/promotions.controller';
import { AuthMiddleware } from './common/auth.middleware';
import { ILogger } from './logger/logger.interface';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types/types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { ItemsController } from './items/items.controller';
import bodyParser from 'body-parser';
import { queryParser } from 'express-query-parser';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExecptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.PromoController) private promoController: PromoController,
		@inject(TYPES.ItemsController) private itemsController: ItemsController,
	) {
		this.app = express();
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		this.app.use(
			queryParser({
				parseNull: true,
				parseUndefined: true,
				parseBoolean: true,
				parseNumber: true,
			}),
		);
		this.port = Number(this.configService.get('PORT')) || 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/promo', this.promoController.router);
		this.app.use('/items', this.itemsController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`App is listening on http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
