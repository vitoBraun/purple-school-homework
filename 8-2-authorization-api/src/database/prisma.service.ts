import { ILogger } from './../logger/logger.interface';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('Connected to Prisma');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(`Connection failed`, e.message);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log('Prisma disconnected from DB');
	}
}
