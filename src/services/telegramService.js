import bot from "../config/telegram.js";
import { supabase } from "../config/supabase.js";

const MEU_CHAT_ID = process.env.MEU_CHAT_ID;

export const notificarNovoUsuario = async (id, nome) => {
    try {
        const mensagem = `🚨 *NOVO CADASTRO REALIZADO* 🚨\n\n👤 *Nome:* ${nome}\n🆔 *ID:* ${id}`;

        const opcoes = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Aprovar", callback_data: `aprovar_${id}` },
                        { text: "❌ Recusar", callback_data: `recusar_${id}` },
                    ],
                ],
            },
            parse_mode: "Markdown",
        };
        await bot.telegram.sendMessage(MEU_CHAT_ID, mensagem, opcoes);
        console.log(` Notificação do usuário ${nome} enviada para o Telegram!`);
    } catch (err) {
        console.error("Erro ao enviar mensagem no Telegram:", err);
    }
};

bot.action(/^(aprovar|recusar)_(.+)$/, async (ctx) => {
    try {
        const acao = ctx.match[1];
        const usuarioId = ctx.match[2];

        const novoStatus = acao === "aprovar" ? "True" : "False";

        const { error } = await supabase.from("usuarios").update({ aprovado: novoStatus }).eq("id", usuarioId);

        if (error) {
            console.error("Erro ao atualizar no Supabase:", error.message);
            await ctx.answerCbQuery("❌ Erro ao atualizar no banco!");
            return;
        }

        const textoResposta = acao === "aprovar" ? "✅ Usuário Aprovado!" : "❌ Usuário Recusado!";
        await ctx.answerCbQuery(textoResposta);

        const mensagemAntiga = ctx.callbackQuery.message.text;
        await ctx.editMessageText(`${mensagemAntiga}\n\n*Status Final:* ${acao === "aprovar" ? "✅ APROVADO" : "❌ RECUSADO"}`, {
            parse_mode: "Markdown",
        });

        console.log(`Usuário ID ${usuarioId} foi ${novoStatus} via Telegram!`);
    } catch (err) {
        console.error("Erro ao processar clique no Telegram:", err);
    }
});
