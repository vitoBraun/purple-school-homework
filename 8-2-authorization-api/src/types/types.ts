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
	TelegramBotService: Symbol.for('TelegramBotService'),
	ChatScenes: Symbol.for('ChatScenes'),
};

export const statusNames = {
	new: 'Новый',
	published: 'Опубликован',
	declined: 'Откланен',
};

export type Status = keyof typeof statusNames;

export const Roles = {
	admin: 'Админ',
	provider: 'Поставщик',
	storeManager: 'Кладовщик',
	storeAdministrator: 'Администратор склада',
};

export type Role = keyof typeof Roles;
