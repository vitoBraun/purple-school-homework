import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-regiter.dto';
import { User } from './user.entity';
import { IUserService } from './users.sevice.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from './types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = await this.configService.get('SALT');
		await newUser.setPassword(password, salt);
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
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
}
