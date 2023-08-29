import { Scenes } from 'telegraf';
import { MyContext } from '../types/types';
const { leave } = Scenes.Stage;

export const menuScene = new Scenes.BaseScene<MyContext>('menu');
menuScene.enter((ctx) => {
	ctx.reply('Вот меню, пожалуста');
});
menuScene.command('back', leave<MyContext>());
