import { PromoRepository } from './../promotions/promotions.repository';
export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),
	ExecptionFilter: Symbol.for('ExecptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('UsersRepository'),
	PromoRepository: Symbol.for('PromoRepository'),
	PromoController: Symbol.for('PromoController'),
	PromoService: Symbol.for('PromoService'),
};
