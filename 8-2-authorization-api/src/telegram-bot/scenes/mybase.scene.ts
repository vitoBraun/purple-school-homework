import { Scenes } from 'telegraf';
import { MyContext } from '../types/types';
import { ScenesNames } from '../telegram-bot.service';
import { injectable } from 'inversify';

@injectable()
export abstract class MyBaseScene {
	public leaveSceneHandler(ctx: MyContext): void {
		ctx.reply('Назад');
		ctx.scene.leave();
	}
}
