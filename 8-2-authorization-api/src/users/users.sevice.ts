import { Role, Roles } from './../types/types';
import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { IUserService } from './types/users.sevice.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types/types';
import { IUsersRepository } from './types/users.repository.interface';
import { UserModel } from '@prisma/client';
import { HttpError } from '../errors/http-error.class';

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
		if (!Object.keys(Roles).includes(type)) {
			throw new HttpError(400, 'Неверный тип пользователя');
		}
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
	async changeUserPassword(email: string, newPassword: string): Promise<UserModel | null> {
		const salt = await this.configService.get('SALT');
		const passwordHash = await User.createHash(newPassword, salt);
		return this.usersRepository.changePassword(email, passwordHash);
	}
	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async getUsersList(): Promise<
		{ id: number; email: string; name: string; type: string }[] | null
	> {
		return this.usersRepository.getList();
	}

	async deleteUser(email: string | string[]): Promise<UserModel | null> {
		return this.usersRepository.delete(email);
	}

	async validateAdmin(email: string): Promise<boolean> {
		const existingUser = await this.usersRepository.find(email);
		if (existingUser?.type === 'admin') {
			return true;
		}
		return false;
	}
}
