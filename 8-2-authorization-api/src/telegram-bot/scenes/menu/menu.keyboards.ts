import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

type Item = {
	name: string;
	callback_data: string;
	description: string;
	price: number;
};

export const getMenuKeyboard = (menu: Item[]): Markup.Markup<InlineKeyboardMarkup> =>
	Markup.inlineKeyboard(menu.map((item) => Markup.button.callback(item.name, item.callback_data)));

export const addToCartButton = (item: Item): Markup.Markup<InlineKeyboardMarkup> =>
	Markup.inlineKeyboard([Markup.button.callback('В корзину', `toCart${item.callback_data}`)]);
