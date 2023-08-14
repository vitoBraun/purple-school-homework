import { UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { Role } from '../../types/types';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	delete: (email: string | string[]) => Promise<UserModel | null>;
	getList: () => Promise<{ id: number; email: string; name: string; type: string }[] | null>;
	changePassword: (email: string, passwordHash: string) => Promise<UserModel | null>;
}
