import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { IUserService } from './types/users.sevice.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types/types';
import { IUsersRepository } from './types/users.repository.interface';
import { UserModel } from '@prisma/client';
import jwt from 'jsonwebtoken';
@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({
		email,
		name,
		password,
		type = 'provider',
	}: {
		email: string;
		name: string;
		password: string;
		type?: string;
	}): Promise<UserModel | null> {
		const newUser = new User(email, name, type);
		const salt = await this.configService.get('SALT');
		await newUser.setPassword(password, salt);
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}
	async validateUser({ email, password }: { email: string; password: string }): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (email !== existedUser?.email) {
			return false;
		}
		const isCorrectPassword = await User.comparePasswords(password, existedUser.password);
		if (!isCorrectPassword) {
			return false;
		}
		return true;
	}
	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async getUserIdFromJWT(token: string): Promise<string | null> {
		const decodedToken = await jwt.decode(token);
		console.log(decodedToken);
		return decodedToken as string;
	}
}
