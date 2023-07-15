import { PrismaService } from './../database/prisma.service';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { IUsersRepository } from './types/users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name, type }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: { email, password, name, type },
		});
	}
	async changePassword(email: string, passwordHash: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.update({
			where: { email },
			data: { password: passwordHash },
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
	async delete(email: string): Promise<UserModel | null> {
		const existingUser = await this.prismaService.client.userModel.findFirst({ where: { email } });
		if (!existingUser) {
			return null;
		}
		return this.prismaService.client.userModel.delete({ where: { email } });
	}
}
