export const validacaoCadastro = (req, res, next) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        console.error("Erro de validação: Nome e senha são obrigatórios.");
        return res.status(400).json({ error: "Nome e senha são obrigatórios." });
    }
    next();
};
