import { PromoModel } from '@prisma/client';
import { CreatePromoDto } from '../dto/promotion.dto';

export interface IPromoService {
	createPromo: (dto: CreatePromoDto) => Promise<PromoModel | null>;
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
	getPromoList: (userEmail?: string) => Promise<PromoModel[] | null>;
}
