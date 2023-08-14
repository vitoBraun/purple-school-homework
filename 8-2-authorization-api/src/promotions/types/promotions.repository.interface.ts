import { PromoModel, UserModel } from '@prisma/client';
import { Promo } from '../promotions.entity';
import { Status } from '../../types/types';

export interface IPromoRepository {
	create: (promo: Promo, user: UserModel) => Promise<PromoModel | null>;
	edit: (promo: { title: string; description: string; id: number }) => Promise<PromoModel>;
	delete: (id: number) => Promise<PromoModel | null>;
	getList: () => Promise<PromoModel[] | null>;
	getListByCreatorId: (id: number) => Promise<PromoModel[] | null>;
	updateStatus: (id: number, status: Status) => Promise<PromoModel | null>;
	find: (id: number, email?: string) => Promise<PromoModel | null>;
}
