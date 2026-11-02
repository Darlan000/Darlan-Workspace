import { Telegraf } from "telegraf";

const token = process.env.TELEGRAM_BOT_TOKEN;

// Inicializa o bot da Telegraf
const bot = new Telegraf(token);

export default bot;
