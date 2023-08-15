import { inject, injectable } from 'inversify';

import { PromoModel, UserModel } from '@prisma/client';

import { IPromoRepository } from './types/promotions.repository.interface';
import { Status, TYPES } from '../types/types';
import { IPromoService } from './types/promotions.service.interface';
import { Promo } from './promotions.entity';

@injectable()
export class PromoService implements IPromoService {
	constructor(@inject(TYPES.PromoRepository) private promoRepository: IPromoRepository) {}
	async createPromo({
		title,
		description,
		user,
	}: {
		title: string;
		description: string;
		user: UserModel;
	}): Promise<PromoModel | null> {
		const newPromo = new Promo(title, description);
		return await this.promoRepository.create(newPromo, user);
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
		return await this.promoRepository.edit({ id, title, description });
	}

	async deletePromo(id: number, email?: string): Promise<PromoModel | null> {
		const existingPromo = await this.promoRepository.find(id, email);
		if (!existingPromo) {
			return null;
		}
		return await this.promoRepository.delete(id);
	}

	async getPromoList({ user }: { user: UserModel }): Promise<PromoModel[] | null> {
		if (user.type === 'storeAdministrator') {
			return await this.promoRepository.getList();
		} else {
			return await this.promoRepository.getListByCreatorId(user.id);
		}
	}
	async updatePromoStatus(id: number, status: Status): Promise<PromoModel | null> {
		const existingPromo = await this.promoRepository.find(id);
		if (!existingPromo) {
			return null;
		}
		return await this.promoRepository.updateStatus(id, status);
	}
}
