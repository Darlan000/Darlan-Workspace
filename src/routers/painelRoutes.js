import { Router } from "express";
import { verificarAutenticacao } from "../middlewares/verificarToken.js";
import { calcularLombada } from "../controllers/calculodelombada.js";
import path from "path";

const router = Router();

const diretorioPages = path.join(process.cwd(), "src", "pages");

router.use(verificarAutenticacao);

router.get("/painel.html", (req, res) => {
    res.sendFile(path.join(diretorioPages, "painel.html"));
});

router.get("/calculodelombada.html", (req, res) => {
    res.sendFile(path.join(diretorioPages, "calculodelombada.html"));
});

router.post("/api/calcular-lombada", calcularLombada);

router.get("/geradorgabarito.html", (req, res) => {
    res.sendFile(path.join(diretorioPages, "geradorgabarito.html"));
});

export default router;
