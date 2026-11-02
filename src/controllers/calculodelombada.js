export const calcularLombada = (req, res) => {
    try {
        const { baseGramatura, quantidadePaginas, cartonado, fresado, costurado } = req.body;

        const base = Number(baseGramatura);
        const paginas = Number(quantidadePaginas);

        if (!base || !paginas || isNaN(paginas)) {
            return res.status(400).json({ sucesso: false, erro: "Dados inválidos para o cálculo." });
        }

        // --- CÁLCULO BASE ---
        let resultadoCalculo = paginas / base;
        let tipoEncadernacaoTexto = "";

        // --- APLICANDO AS REGRAS DE ENCADERNAÇÃO ---

        // 1. Cartonado tem prioridade e soma +4mm
        if (cartonado) {
            resultadoCalculo += 4;
            tipoEncadernacaoTexto = "Cartonado";

            if (fresado) tipoEncadernacaoTexto += " e Fresado";
            if (costurado) tipoEncadernacaoTexto += " e Costurado";
        }
        // 2. Se não é cartonado, verifica se é Costurado (+1mm)
        else if (costurado) {
            resultadoCalculo += 1;
            tipoEncadernacaoTexto = "Costurado";
        }
        // 3. Se sobrou, é Fresado (+0mm)
        else if (fresado) {
            resultadoCalculo += 0;
            tipoEncadernacaoTexto = "Fresado";
        }

        const resultadoFormatado = `${resultadoCalculo.toFixed(1)} mm`;

        // Retorna tanto o valor formatado quanto o texto descritivo para o front-end
        return res.json({
            sucesso: true,
            resultado: resultadoFormatado,
            tipoEncadernacao: tipoEncadernacaoTexto,
        });
    } catch (error) {
        console.error("Erro no cálculo de lombada:", error);
        return res.status(500).json({ sucesso: false, erro: "Erro ao processar o cálculo da lombada." });
    }
};
