import { PrismaService } from './../database/prisma.service';
import { PromoModel } from '@prisma/client';

import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { IPromoRepository } from './types/promotions.repository.interface';
import { Promo } from './promotions.entity';

@injectable()
export class PromoRepository implements IPromoRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ title, description, creatorEmail }: Promo): Promise<PromoModel> {
		return this.prismaService.client.promoModel.create({
			data: { title, description, creatorEmail },
		});
	}
	async edit({
		title,
		description,
		id,
	}: {
		title: string;
		description: string;
		id: number;
	}): Promise<PromoModel> {
		return this.prismaService.client.promoModel.update({
			where: { id },
			data: { title, description },
		});
	}
	async delete(id: number): Promise<PromoModel | null> {
		return this.prismaService.client.promoModel.delete({
			where: { id },
		});
	}
	async getList(userEmail: string): Promise<PromoModel[] | null> {
		return this.prismaService.client.promoModel.findMany({
			where: { creatorEmail: userEmail },
		});
	}
	async find(id: number): Promise<PromoModel | null> {
		return this.prismaService.client.promoModel.findFirst({
			where: { id },
		});
	}
}
