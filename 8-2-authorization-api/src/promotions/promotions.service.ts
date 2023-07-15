import { inject, injectable } from 'inversify';

import { PromoModel, UserModel } from '@prisma/client';
import { IConfigService } from '../config/config.service.interface';
import { IPromoRepository } from './types/promotions.repository.interface';
import { TYPES } from '../types/types';
import { IPromoService } from './types/promotions.service.interface';
import { Promo } from './promotions.entity';

@injectable()
export class PromoService implements IPromoService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PromoRepository) private promoRepository: IPromoRepository,
	) {}
	async createPromo({
		title,
		description,
		creatorEmail,
	}: {
		title: string;
		description: string;
		creatorEmail: string;
	}): Promise<PromoModel> {
		const newPromo = new Promo(title, description, creatorEmail);
		return await this.promoRepository.create(newPromo);
	}

	async editPromo({
		id,
		title,
		description,
	}: {
		id: number;
		title: string;
		description: string;
	}): Promise<PromoModel | null> {
		const editedPromo = await this.promoRepository.edit({ id, title, description });
		return editedPromo;
	}

	async deletePromo(id: number, email?: string): Promise<PromoModel | null> {
		const existingPromo = await this.promoRepository.find(id, email);
		if (!existingPromo) {
			return null;
		}
		const deletedExistePromo = await this.promoRepository.delete(id);
		return deletedExistePromo;
	}

	async getPromoList(userEmail?: string): Promise<PromoModel[] | null> {
		const list = await this.promoRepository.getList(userEmail && userEmail);
		return list;
	}
}
