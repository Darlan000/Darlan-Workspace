const formLombada = document.getElementById("formLombada");

// 1. Variável global para guardar os dados do JSON
let dadosPapeis = [];

// Seletores dos elementos do HTML
const tipoPapelSelect = document.getElementById("TipoPapel");
const tipoGramaturaSelect = document.getElementById("TipoGramatura");

const checkboxFresado = document.getElementById("tipoCapaFresado");
const checkboxCosturado = document.getElementById("tipoCapaCosturado");

// Elementos do pop-up de resultado
const popupResultado = document.getElementById("popupResultado");
const popupMensagem = document.getElementById("popupMensagem");
const closeButton = document.querySelector(".close-button");

// Regra de exclusão mútua: ou é fresado, ou é costurado
checkboxFresado.addEventListener("change", () => {
    if (checkboxFresado.checked) {
        checkboxCosturado.checked = false;
    }
    if (popupResultado) popupResultado.style.display = "none";
});

checkboxCosturado.addEventListener("change", () => {
    if (checkboxCosturado.checked) {
        checkboxFresado.checked = false;
    }
    if (popupResultado) popupResultado.style.display = "none";
});

async function carregarDadosPapeis() {
    try {
        const response = await fetch("/data/papeisgramaturas.json");

        if (!response.ok) {
            throw new Error(`Erro ao carregar: ${response.status}`);
        }

        const dados = await response.json();
        console.log("Dados convertidos com sucesso:", dados);

        // Salva na variável global e popula o primeiro select
        dadosPapeis = dados;
        popularTipoPapel();
    } catch (error) {
        console.error("Erro no carregamento:", error);
    }
}

// 2. Função que joga os nomes dos papéis dentro do select de papel
function popularTipoPapel() {
    tipoPapelSelect.innerHTML = '<option value="" disabled selected>Selecione o tipo de papel</option>';

    dadosPapeis.forEach((papel) => {
        const option = document.createElement("option");
        option.value = papel.nome;
        option.textContent = papel.nome;
        tipoPapelSelect.appendChild(option);
    });
}

// 3. Quando o usuário mudar o papel, filtra e popula as gramaturas daquele papel específico
tipoPapelSelect.addEventListener("change", () => {
    const papelSelecionado = tipoPapelSelect.value;

    // Reseta o select de gramatura
    tipoGramaturaSelect.innerHTML = '<option value="" disabled selected>Selecione o tipo de Gramatura</option>';
    tipoGramaturaSelect.disabled = true;

    if (popupResultado) popupResultado.style.display = "none";

    if (!papelSelecionado) return;

    // Procura o papel escolhido dentro dos dados
    const papelEncontrado = dadosPapeis.find((p) => p.nome === papelSelecionado);

    if (papelEncontrado && papelEncontrado.gramaturas.length > 0) {
        tipoGramaturaSelect.disabled = false; // Libera o select de gramatura

        papelEncontrado.gramaturas.forEach((g) => {
            const option = document.createElement("option");
            option.value = g.base; // Envia o valor da base para o back-end
            option.textContent = `${g.valor}g`; // Exibe a gramatura visualmente para o usuário
            tipoGramaturaSelect.appendChild(option);
        });
    }
});

// Esconde o pop-up se mexer na gramatura ou nas páginas
tipoGramaturaSelect.addEventListener("change", () => {
    if (popupResultado) popupResultado.style.display = "none";
});

const quantidadePaginasInput = document.getElementById("quantidadePaginas");
if (quantidadePaginasInput) {
    quantidadePaginasInput.addEventListener("input", () => {
        if (popupResultado) popupResultado.style.display = "none";
    });
}

// Fechar o pop-up ao clicar no botão "X"
if (closeButton && popupResultado) {
    closeButton.addEventListener("click", () => {
        popupResultado.style.display = "none";
    });

    // Fechar ao clicar fora da caixa do pop-up
    window.addEventListener("click", (event) => {
        if (event.target === popupResultado) {
            popupResultado.style.display = "none";
        }
    });
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosPapeis();
});

// Envio do formulário integrando com o back-end e exibindo no pop-up
formLombada.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fresado = checkboxFresado.checked;
    const costurado = checkboxCosturado.checked;

    if (fresado && costurado) {
        alert("Atenção: Você não pode selecionar 'Fresado' e 'Costurado' ao mesmo tempo. Escolha apenas um tipo de miolo.");
        return;
    }

    try {
        const resposta = await fetch("/painel/api/calcular-lombada", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                baseGramatura: tipoGramaturaSelect.value,
                quantidadePaginas: document.getElementById("quantidadePaginas").value,
                cartonado: document.getElementById("tipoEncadernacao").checked,
                fresado: fresado,
                costurado: costurado,
            }),
        });

        const dados = await resposta.json();
        console.log("Resultado do cálculo:", dados);

        if (dados.sucesso) {
            // Exibe o resultado formatado (ex: "05.40mm") dentro do pop-up da tela
            popupMensagem.textContent = `A lombada é: ${dados.resultado}`;
            popupResultado.style.display = "flex";
        } else {
            popupMensagem.textContent = dados.erro || "Erro ao calcular.";
            popupResultado.style.display = "flex";
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        popupMensagem.textContent = "Erro de conexão com o servidor.";
        popupResultado.style.display = "flex";
    }
});
