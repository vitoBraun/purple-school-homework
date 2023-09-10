import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

type Menu = {
	name: string;
	callback_data: string;
	description: string;
	price: number;
};

export const getMenuKeyboard = (menu: Menu[]): Markup.Markup<InlineKeyboardMarkup> =>
	Markup.inlineKeyboard(menu.map((item) => Markup.button.callback(item.name, item.callback_data)));
