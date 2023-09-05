import { Markup, Scenes } from 'telegraf';
import { MyContext } from '../types/types';
import { injectable, inject } from 'inversify';
import { ItemsRepository } from './../../items/items.repository';

import { TYPES } from '../../types/types';
import { ScenesEnum } from '../telegram-bot.service';
const { leave } = Scenes.Stage;

@injectable()
export class ChatScenes {
	welcomeScene;
	menuScene;
	constructor(@inject(TYPES.ItemsRepository) private ItemsRepository: ItemsRepository) {
		this.welcomeScene = new Scenes.BaseScene<MyContext>(ScenesEnum.WELCOME);
		this.menuScene = new Scenes.BaseScene<MyContext>(ScenesEnum.MENU);

		this.useWelcomeScene();
		this.useMenuScene();
	}
	useWelcomeScene(): void {
		this.welcomeScene.enter((ctx) => {
			ctx.reply('Привет это бот для интернет магазина! Введите ваш город');
		});
		this.welcomeScene.command('back', leave<MyContext>());
		this.welcomeScene.on('text', (ctx) => {
			ctx.reply(`Ваш город: "${ctx.message.text}"`);
			ctx.scene.enter(ScenesEnum.MENU);
		});
		this.welcomeScene.command('back', this.leaveSceneHandler);
	}
	useMenuScene(): void {
		this.menuScene.enter(async (ctx) => {
			const items = await this.ItemsRepository.getItems();
			const menu = items.map((item) => ({
				name: item.name,
				callback_data: item.id.toString(),
				description: item.description,
				price: item.price,
			}));
			await ctx.reply(
				'Меню:',
				Markup.inlineKeyboard(
					menu.map((item) => Markup.button.callback(item.name, item.callback_data)),
				),
			);
			menu.forEach((item) =>
				this.menuScene.action(item.callback_data, (ctx) => {
					ctx.reply(`Товар: ${item.name} 
					Описание: ${item.description} 
					Цена:  ${item.price}`);
				}),
			);
		});
		this.menuScene.command('back', this.leaveSceneHandler);
	}
	leaveSceneHandler(ctx: MyContext): void {
		ctx.reply('Назад');
		ctx.scene.leave();
	}
}
