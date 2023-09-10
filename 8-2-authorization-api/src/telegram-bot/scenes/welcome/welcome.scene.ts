import { ScenesNames } from './../../telegram-bot.service';
import { MyBaseScene } from '../mybase.scene';
import { MyContext } from '../../types/types';
import { Scenes } from 'telegraf';
import { injectable } from 'inversify';
const { leave } = Scenes.Stage;

export interface IWelcomeScene {
	useWelcomeScene: () => void;
}

@injectable()
export class WelcomeScene extends MyBaseScene implements IWelcomeScene {
	scene;
	constructor() {
		super();
		this.scene = new Scenes.BaseScene<MyContext>(ScenesNames.WELCOME);
		this.useWelcomeScene();
	}
	useWelcomeScene(): void {
		this.scene.enter((ctx) => {
			ctx.reply('Привет это бот для интернет магазина! Введите ваш город');
		});
		this.scene.command('back', leave<MyContext>());
		this.scene.on('text', (ctx) => {
			ctx.reply(`Ваш город: "${ctx.message.text}"`);
			ctx.scene.enter(ScenesNames.MENU);
		});
		this.scene.command('back', this.leaveSceneHandler);
	}
}
