import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import usuariosRouter from "./src/routers/usuarios.js";
import bot from "./src/config/telegram.js";
import "./src/services/telegramService.js";
import painelRoutes from "./src/routers/painelRoutes.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api", usuariosRouter);
app.use("/painel", painelRoutes);

bot.launch();
console.log("Robô do Telegram iniciado com sucesso!");

app.listen(3000, () => {
    console.log(`Servidor rodando tinindo em: http://localhost:3000`);
});
