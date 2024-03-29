import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-regiter.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	getUsersList: () => Promise<{ id: number; email: string; name: string; type: string }[] | null>;
	changeUserPassword: (email: string, newPassword: string) => Promise<UserModel | null>;
	validateAdmin: (email: string) => Promise<boolean>;
}
