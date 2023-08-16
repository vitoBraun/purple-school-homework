declare namespace Express {
	import { User } from '../users/user.entity';
	export interface Request {
		user: User;
	}
}
