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
	ItemsService: Symbol.for('ItemsService'),
	ItemsRepository: Symbol.for('ItemsRepository'),
	ItemsController: Symbol.for('ItemsController'),
	QueryFormatter: Symbol.for('QueryFormatter'),
};

export type Status = 'new' | 'published' | 'declined';
export type Roles = 'admin' | 'provider' | 'storeManager' | 'storeAdministrator';
