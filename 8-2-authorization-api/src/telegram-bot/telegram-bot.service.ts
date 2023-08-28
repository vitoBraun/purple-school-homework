import { ItemsRepository } from './../items/items.repository';
import { LoggerService } from './../logger/logger.service';
import { ConfigService } from './../config/config.service';
import { Scenes, Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import LocalSession from 'telegraf-session-local';
import { MyContext } from './types/types';
import { testScene } from './scenes/test.scene';
import { ITelegramBotService } from './types/telegram-bot.service.interface';

@injectable()
export class TelegramBotService implements ITelegramBotService {
	bot;
	token;
	stage;

	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.ItemsRepository) private ItemsRepository: ItemsRepository,
	) {
		this.token = this.configService.get('TOKEN');
		this.bot = new Telegraf<MyContext>(this.token);
		this.stage = new Scenes.Stage<MyContext>([testScene]);
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
		this.bot.use(this.stage.middleware());

		this.bot.command('start', (ctx) => {
			ctx.scene.enter('welcome');
		});
	}
	init(): void {
		this.bot.launch();
		this.loggerService.log('Telegram bot launched');
	}
}
