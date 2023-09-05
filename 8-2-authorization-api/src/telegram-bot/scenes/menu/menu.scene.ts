import { ScenesNames } from './../../telegram-bot.service';
import { MyBaseScene } from '../mybase.scene';
import { Markup } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types/types';
import { ItemsRepository } from './../../../items/items.repository';

@injectable()
export class MenuScene extends MyBaseScene {
	constructor(@inject(TYPES.ItemsRepository) private ItemsRepository: ItemsRepository) {
		super(ScenesNames.MENU);
	}
	useMenuScene(): void {
		this.scene.enter(async (ctx) => {
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
				this.scene.action(item.callback_data, (ctx) => {
					ctx.reply(`Товар: ${item.name} 
					Описание: ${item.description} 
					Цена:  ${item.price}`);
				}),
			);
		});
		this.scene.command('back', this.leaveSceneHandler);
	}
}
