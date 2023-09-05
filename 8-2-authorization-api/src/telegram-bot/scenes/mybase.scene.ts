import { Scenes } from 'telegraf';
import { MyContext } from '../types/types';
import { ScenesNames } from '../telegram-bot.service';
import { injectable } from 'inversify';

@injectable()
export class MyBaseScene {
	public scene;
	constructor(private sceneName: ScenesNames) {
		this.scene = new Scenes.BaseScene<MyContext>(this.sceneName);
	}
	public leaveSceneHandler(ctx: MyContext): void {
		ctx.reply('Назад');
		ctx.scene.leave();
	}
}
