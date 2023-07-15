import { PrismaService } from './../database/prisma.service';
import { PromoModel } from '@prisma/client';

import { inject, injectable } from 'inversify';
import { Status, TYPES } from '../types/types';
import { IPromoRepository } from './types/promotions.repository.interface';
import { Promo } from './promotions.entity';
import { resolveListQuery } from '../common/utils';

@injectable()
export class PromoRepository implements IPromoRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, description }: Promo, user: string): Promise<PromoModel | null> {
		const creatorId = await this.getCreatorId(user);
		if (!creatorId) {
			return null;
		}
		return this.prismaService.client.promoModel.create({
			data: { title, description, creatorId },
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
		params?: Record<string, any>;
	}): Promise<PromoModel[] | null> {
		const { filter, paggination, restParams } = resolveListQuery(params);
		if (!userEmail) {
			return this.prismaService.client.promoModel.findMany({ where: filter, ...paggination });
		} else {
			const creatorId = await this.getCreatorId(userEmail);
			if (!creatorId) {
				return null;
			}
			return this.prismaService.client.promoModel.findMany({
				where: { creatorId, ...restParams },
				...paggination,
			});
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
