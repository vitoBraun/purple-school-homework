import { PromoModel } from '@prisma/client';
import { Promo } from '../promotions.entity';

export interface IPromoRepository {
	create: (promo: Promo) => Promise<PromoModel>;
	edit: (promo: { title: string; description: string; id: number }) => Promise<PromoModel>;
	delete: (id: number) => Promise<PromoModel | null>;
	getList: (userEmail: string) => Promise<PromoModel[] | null>;
	find: (id: number) => Promise<PromoModel | null>;
}
