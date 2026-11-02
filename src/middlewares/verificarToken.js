import jwt from "jsonwebtoken";

export const verificarAutenticacao = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        if (req.accepts("html")) {
            return res.redirect("/");
        }
        return res.status(401.0).json({ status: "erro", mensagem: "Token não fornecido" });
    }

    try {
        const decodificacao = jwt.verify(token, process.env.JWT_SECRET);

        req.usuarioLogado = decodificacao;

        next();
    } catch (err) {
        if (req.accepts("html")) {
            return res.redirect("/");
        }
        return res.status(403.0).json({ status: "erro", mensagem: "Token inválido ou expirado" });
    }
};
