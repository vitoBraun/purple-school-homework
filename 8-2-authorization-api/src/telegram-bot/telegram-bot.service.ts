import { LoggerService } from './../logger/logger.service';
import { ConfigService } from './../config/config.service';
import { Scenes, Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import LocalSession from 'telegraf-session-local';
import { MyContext } from './types/types';

import { ITelegramBotService } from './types/telegram-bot.service.interface';
import { WelcomeScene } from './scenes/welcome/welcome.scene';
import { MenuScene } from './scenes/menu/menu.scene';

export enum ScenesNames {
	WELCOME = 'welcome',
	MENU = 'menu',
}

@injectable()
export class TelegramBotService implements ITelegramBotService {
	bot;
	token;
	stage;

	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.ILogger) private loggerService: LoggerService,
		@inject(TYPES.WelcomeScene) private welcomeScene: WelcomeScene,
		@inject(TYPES.MenuScene) private menuScene: MenuScene,
	) {
		this.token = this.configService.get('TOKEN');

		this.bot = new Telegraf<MyContext>(this.token);
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());

		this.stage = new Scenes.Stage<MyContext>([this.welcomeScene.scene]);
		this.bot.use(this.stage.middleware());

		this.bot.command('start', (ctx) => {
			ctx.scene.enter(ScenesNames.WELCOME);
		});
		this.bot.command('menu', (ctx) => {
			ctx.scene.enter(ScenesNames.MENU);
		});
	}
	init(): void {
		this.bot.launch();
		this.loggerService.log('Telegram bot launched');
	}
}
