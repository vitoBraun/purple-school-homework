import { Scenes } from 'telegraf';
import { MyContext } from '../types/types';
const { leave } = Scenes.Stage;

export const welcomeScene = new Scenes.BaseScene<MyContext>('welcome');
welcomeScene.enter((ctx) => {
	ctx.reply('Привет это бот для интернет магазина! Введите ваш город');
});
welcomeScene.command('back', leave<MyContext>());
welcomeScene.on('text', (ctx) => {
	ctx.reply(`Ваш город: "${ctx.message.text}"`);
	ctx.scene.enter('menu');
});
