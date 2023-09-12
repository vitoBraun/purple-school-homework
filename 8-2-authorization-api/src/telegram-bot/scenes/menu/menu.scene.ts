import { addToCartButton, getMenuKeyboard } from './menu.keyboards';
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
				id: item.id,
				name: item.name,
				callback_data: item.id.toString(),
				description: item.description,
				price: item.price,
			}));
			await ctx.reply('Меню:', getMenuKeyboard(menu));
			menu.forEach((item) => {
				this.scene.action(item.callback_data, (ctx) => {
					ctx.reply(getItemTemplate(item), addToCartButton(item));
				});
				this.scene.action(`toCart${item.callback_data}`, (ctx) => {
					if (ctx.from?.id) {
						this.ItemsRepository.addCartItem({ userId: ctx.from?.id, itemId: item.id });
					} else {
						throw new Error('User id is undefined');
					}

					ctx.reply(`Товар ${item.name} добавлен в корзину`);
				});
			});
			this.scene.command('cart', (ctx) => {
				ctx.reply(`${ctx.cart}`);
			});
		});
		this.scene.command('back', this.leaveSceneHandler);
	}
}
