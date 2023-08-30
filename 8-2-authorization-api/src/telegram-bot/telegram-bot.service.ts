import { ItemsRepository } from './../items/items.repository';
import { LoggerService } from './../logger/logger.service';
import { ConfigService } from './../config/config.service';
import { Scenes, Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import LocalSession from 'telegraf-session-local';
import { MyContext } from './types/types';

import { ITelegramBotService } from './types/telegram-bot.service.interface';
import { ChatScenes } from './scenes/chat.scenes';

@injectable()
export class TelegramBotService implements ITelegramBotService {
	bot;
	token;
	stage;

	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.ChatScenes) private chatScenes: ChatScenes,
	) {
		this.token = this.configService.get('TOKEN');

		this.bot = new Telegraf<MyContext>(this.token);
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());

		this.stage = new Scenes.Stage<MyContext>([
			this.chatScenes.welcomeScene,
			this.chatScenes.menuScene,
		]);
		this.bot.use(this.stage.middleware());

		this.bot.command('start', (ctx) => {
			ctx.scene.enter('welcome');
		});
		this.bot.command('menu', (ctx) => {
			ctx.scene.enter('menu');
		});
	}
	init(): void {
		this.bot.launch();
		this.loggerService.log('Telegram bot launched');
	}
}
