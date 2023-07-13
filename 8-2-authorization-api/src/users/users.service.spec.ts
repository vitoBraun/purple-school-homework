import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './users.sevice.interface';
import { TYPES } from './types/types';
import { UserService } from './users.sevice';
import { IUsersRepository } from './users.repository.interface';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = { find: jest.fn(), create: jest.fn() };

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;
const credentials = {
	email: 'a@a.ru',
	password: 'qwerty1234',
	name: 'Vasya',
};

describe('Users Service', () => {
	it('Creates user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('2');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await userService.createUser(credentials);
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('qwerty1234');
	});
	it('Validate user success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const result = await userService.validateUser({
			email: credentials.email,
			password: credentials.password,
		});
		expect(result).toBeTruthy();
	});
	it('Restrics user om wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: credentials.email,
			password: 'wrong_password',
		});
		expect(result).toBeFalsy();
	});
	it('Restrics user om wrong email', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await userService.validateUser({
			email: 'wrong_email',
			password: credentials.password,
		});
		expect(result).toBeFalsy();
	});
});
