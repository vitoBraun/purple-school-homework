import "dotenv/config";
import { Context, Markup, Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
const token = process.env.TOKEN;
const { leave } = Scenes.Stage;

if (!token) throw new Error("Токен не задан");

interface MySessionScene extends Scenes.SceneSessionData {
  mtProps: string;
}

interface MySession extends Scenes.SceneSession<MySessionScene> {
  myProp: string;
}

interface MyContext extends Context {
  props: string;
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext, MySessionScene>;
}

const testScene = new Scenes.BaseScene<MyContext>("test");
testScene.enter((ctx) => {
  ctx.reply("Hi!");
});
testScene.command("back", leave<MyContext>());
testScene.on("text", (ctx) => {
  ctx.reply(ctx.message.text);
});
testScene.leave((ctx) => {
  ctx.reply("Bye!");
});

const stage = new Scenes.Stage<MyContext>([testScene]);

const bot = new Telegraf<MyContext>(token);

bot.use(new LocalSession({ database: "session.json" }).middleware());
bot.use(stage.middleware());

bot.use((ctx, next) => {
  ctx.session.myProp;
  ctx.scene.session.mtProps;
  next();
});
bot.command("test", (ctx) => {
  ctx.scene.enter("test");
});
bot.launch();
