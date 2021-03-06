import { Telegraf } from 'telegraf';
import { listCurrency } from './controllers/list-currency';
import { Currency } from './middleware/Currency';
import { env } from './util/Env';
import { CurrencyAdapter } from './util/CurrencyAdapter';

export class CurrencyBot {
  constructor(private readonly bot = new Telegraf(env('BOT_TOKEN'))) {
    this.bot = bot;
    bot.start((ctx) => ctx.reply('Hello I am currency bot. \n /list - list of all currencies'));
  }

  initCommands() {
    this.bot.command('/list', listCurrency);
  }

  async initHears() {
    const currencyList = await new Currency().getCurrencyList();
    const groupBy = new CurrencyAdapter(currencyList).makeRegExp();
    const currencyHears = new RegExp(groupBy);
    this.bot.hears(currencyHears, (ctx) => {
      const [filteredBySlug] = currencyList.filter((item) => item
        .CurrencyCodeL === ctx.match.input);
      ctx.reply(`${ctx.match.input} - ${filteredBySlug?.Amount}`);
    });
  }

  launch() {
    this.bot.launch();
    this.initCommands();
    this.initHears();
  }
}
