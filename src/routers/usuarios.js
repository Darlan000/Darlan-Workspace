import express from "express";
import { gerarTokenCookie } from "../services/token.js";
import { supabase } from "../config/supabase.js";
import { notificarNovoUsuario } from "../services/telegramService.js";
import { validacaoCadastro } from "../middlewares/validacaoCadastro.js";
import { validacaoLogin } from "../middlewares/validacaologin.js";

const router = express.Router();

router.post("/cadastro", validacaoCadastro, async (req, res) => {
    const { nome, senha } = req.body;

    try {
        // Adicionamos o .select() para o Supabase devolver o ID gerado
        const { data, error } = await supabase.from("usuarios").insert([{ nome, senha }]).select();

        if (error) {
            console.error("Erro ao salvar no Supabase:", error.message);
            return res.status(400).json({ status: "erro", mensagem: error.message });
        }

        const novoUsuario = data[0];

        notificarNovoUsuario(novoUsuario.id, novoUsuario.nome);

        console.log(`Usuário ${nome} cadastrado com sucesso no Supabase!`);
        return res.json({ status: "sucesso", mensagem: "Cadastro realizado com sucesso!" });
    } catch (err) {
        console.error("Erro interno:", err);
        return res.status(500).json({ status: "erro", mensagem: "Erro interno no servidor" });
    }
});

router.post("/entrar", validacaoLogin, async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const { data, error } = await supabase.from("usuarios").select("*").eq("nome", nome);

        if (error) {
            console.error("Erro ao consultar no Supabase:", error.message);
            return res.status(400).json({ status: "erro", mensagem: error.message });
        }

        if (!data || data.length === 0) {
            console.log(`Tentativa de login com nome de usuário não encontrado: ${nome}.`);
            return res.status(404).json({ status: "erro", mensagem: "Usuário não encontrado" });
        }

        const usuario = data[0];

        if (usuario.senha !== senha) {
            console.log(`Tentativa de login com senha incorreta para o usuário ${nome}.`);
            return res.status(401).json({ status: "erro", mensagem: "Senha incorreta" });
        }

        if (usuario.aprovado === false) {
            console.log(`Tentativa de login do usuário ${nome} que não foi aprovado.`);
            return res.status(403).json({ status: "erro", mensagem: "Usuário não aprovado" });
        }

        gerarTokenCookie(res, usuario);

        console.log(`Usuário ${nome} logado com sucesso!`);

        return res.json({ status: "sucesso", mensagem: "Login realizado com sucesso!" });
    } catch (err) {
        console.error("Erro interno:", err);
        return res.status(500).json({ status: "erro", mensagem: "Erro interno no servidor" });
    }
});

export default router;
