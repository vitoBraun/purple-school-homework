import { PromoModel, UserModel } from '@prisma/client';
import { CreatePromoDto } from '../dto/promotion.dto';
import { Status } from '../../types/types';

class ExtendedCreatePromoDto extends CreatePromoDto {
	user: UserModel;
}

export interface EditPromoParams {
	id: number;
	title: string;
	description: string;
}

export interface IPromoService {
	createPromo: (dto: ExtendedCreatePromoDto) => Promise<PromoModel | null>;
	editPromo: (params: EditPromoParams) => Promise<PromoModel | null>;
	deletePromo: (id: number, email?: string) => Promise<PromoModel | null>;
	updatePromoStatus: (id: number, status: Status) => Promise<PromoModel | null>;
	getPromoList: ({ user }: { user: UserModel }) => Promise<PromoModel[] | null>;
}
