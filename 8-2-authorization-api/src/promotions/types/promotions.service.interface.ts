import { PromoModel, UserModel } from '@prisma/client';
import { CreatePromoDto } from '../dto/promotion.dto';
import { Status } from '../../types/types';

class ExtendedCreatePromoDto extends CreatePromoDto {
	user: UserModel;
}

export interface IPromoService {
	createPromo: (dto: ExtendedCreatePromoDto) => Promise<PromoModel | null>;
	editPromo: ({
		id,
		title,
		description,
	}: {
		id: number;
		title: string;
		description: string;
	}) => Promise<PromoModel | null>;
	deletePromo: (id: number, email?: string) => Promise<PromoModel | null>;
	updatePromoStatus: (id: number, status: Status) => Promise<PromoModel | null>;
	getPromoList: ({
		userEmail,
		params,
	}: {
		userEmail?: string;
		params: Record<string, any>;
	}) => Promise<PromoModel[] | null>;
}
