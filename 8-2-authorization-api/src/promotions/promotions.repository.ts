import { PrismaService } from './../database/prisma.service';
import { PromoModel, UserModel } from '@prisma/client';

import { inject, injectable } from 'inversify';
import { Status, TYPES } from '../types/types';
import { IPromoRepository } from './types/promotions.repository.interface';
import { Promo } from './promotions.entity';

@injectable()
export class PromoRepository implements IPromoRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, description }: Promo, user: UserModel): Promise<PromoModel | null> {
		if (!user) {
			throw new Error(`User not found`);
		}

		return this.prismaService.client.promoModel.create({
			data: { title, description, creatorId: user?.id, creatorEmail: user?.email },
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
	async updateStatus(id: number, status: Status): Promise<PromoModel | null> {
		return this.prismaService.client.promoModel.update({ where: { id }, data: { status } });
	}

	async delete(id: number): Promise<PromoModel | null> {
		return this.prismaService.client.promoModel.delete({
			where: { id },
		});
	}
	async getList({
		userEmail,
		params,
	}: {
		userEmail?: string;
		params: any;
	}): Promise<PromoModel[] | null> {
		if (!userEmail) {
			return this.prismaService.client.promoModel.findMany(params);
		} else {
			const creatorId = await this.getCreatorId(userEmail);
			if (!creatorId) {
				return null;
			}

			return this.prismaService.client.promoModel.findMany(params);
		}
	}
	async find(id: number, email?: string): Promise<PromoModel | null> {
		const creatorId = email ? await this.getCreatorId(email) : undefined;
		return this.prismaService.client.promoModel.findFirst({
			where: { id, ...(creatorId && { creatorId }) },
		});
	}

	private async getCreatorId(email: string): Promise<number | null> {
		const creator = await this.prismaService.client.userModel.findFirst({
			where: { email },
		});
		if (!creator) {
			return null;
		}
		return creator.id;
	}
}
