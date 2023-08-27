import { Scenes } from 'telegraf';
import { MyContext } from '../types/types';
const { leave } = Scenes.Stage;

export const testScene = new Scenes.BaseScene<MyContext>('welcome');
testScene.enter((ctx) => {
	ctx.reply('Привет это бот для интернет магазина!');
});
testScene.command('back', leave<MyContext>());
testScene.on('text', (ctx) => {
	ctx.reply(`Вы написали: "${ctx.message.text}"`);
});
testScene.leave((ctx) => {
	ctx.reply('До свидания!');
});
