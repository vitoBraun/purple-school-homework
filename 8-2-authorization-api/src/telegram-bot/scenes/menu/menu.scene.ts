import { getMenuKeyboard } from './menu.keyboards';
import { ScenesNames } from './../../telegram-bot.service';
import { MyBaseScene } from '../mybase.scene';
import { Markup, Scenes } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types/types';
import { ItemsRepository } from './../../../items/items.repository';
import { MyContext } from '../../types/types';
import { getItemTemplate } from './menu.templates';

export interface IMenuScene {
	useMenuScene: () => void;
}

@injectable()
export class MenuScene extends MyBaseScene implements IMenuScene {
	scene;
	constructor(@inject(TYPES.ItemsRepository) private ItemsRepository: ItemsRepository) {
		super();
		this.scene = new Scenes.BaseScene<MyContext>(ScenesNames.MENU);
		this.useMenuScene();
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
			await ctx.reply('Меню:', getMenuKeyboard(menu));
			menu.forEach((item) =>
				this.scene.action(item.callback_data, (ctx) => {
					ctx.reply(getItemTemplate(item));
				}),
			);
		});
		this.scene.command('back', this.leaveSceneHandler);
	}
}
