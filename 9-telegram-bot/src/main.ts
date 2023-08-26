import "dotenv/config";
import { Context, Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { PrismaService } from "./database/prisma.service";
const token = process.env.TOKEN;
const { leave } = Scenes.Stage;

if (!token) throw new Error("Токен не задан");

const db = new PrismaService();
db.connect();

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

const testScene = new Scenes.BaseScene<MyContext>("welcome");
testScene.enter((ctx) => {
  ctx.reply("Привет это бот для интернет магазина!");
});
testScene.command("back", leave<MyContext>());
testScene.on("text", (ctx) => {
  ctx.reply(`Вы написали: "${ctx.message.text}"`);
});
testScene.leave((ctx) => {
  ctx.reply("До свидания!");
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
bot.command("start", (ctx) => {
  ctx.scene.enter("welcome");
});
bot.launch();
