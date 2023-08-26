
import { PrismaClient } from '@prisma/client';


export class PrismaService {
	client: PrismaClient;
	constructor() {
		this.client = new PrismaClient();
	}
	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			console.log('Connected to Prisma');
		} catch (e) {
			if (e instanceof Error) {
				console.error(`Connection failed`, e.message);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		console.log('Prisma disconnected from DB');
	}
}
