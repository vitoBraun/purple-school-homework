import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExecptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './users/types/types';
import { UserController } from './users/users.controller';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/types/users.controller.interface';
import { UserService } from './users/users.sevice';
import { IUserService } from './users/types/users.sevice.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/types/users.repository.interface';

export interface IBootsrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExecptionFilter).to(ExecptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootsrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
