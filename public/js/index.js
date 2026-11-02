const formLogin = document.getElementById("form-login");
const conectar = document.getElementById("conectar");
const cadastrarSe = document.getElementById("cadastrar-se");

const formCadastro = document.getElementById("form-cadastro");
const cadastrar = document.getElementById("cadastrar");
const voltar = document.getElementById("voltar");

cadastrarSe.addEventListener("click", (e) => {
    e.preventDefault();
    formLogin.classList.add("escondido");
    formCadastro.classList.remove("escondido");
});

voltar.addEventListener("click", (e) => {
    e.preventDefault();
    formCadastro.classList.add("escondido");
    formLogin.classList.remove("escondido");
});

cadastrar.addEventListener("click", async (e) => {
    e.preventDefault();

    const resposta = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: formCadastro.nomeCadastro.value,
            senha: formCadastro.senhaCadastro.value,
        }),
    });

    const resultado = await resposta.json();
    console.log(resultado);
});

conectar.addEventListener("click", async (e) => {
    e.preventDefault();

    const resposta = await fetch("/api/entrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: formLogin.nomeLogin.value,
            senha: formLogin.senhaLogin.value,
        }),
    });

    const resultado = await resposta.json();
    if (resultado.status === "sucesso") {
        window.location.href = "/painel/painel.html";
    } else {
        alert(resultado.mensagem);
    }
    console.log(resultado);
});
