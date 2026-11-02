meu-projeto/
├── node_modules
├── public/
│ ├── index.html (Login e Cadastro)
│ ├── painel.html (Onde ficam a calculadora e o gerador de PDF)
│ ├── css/
│ │ ├── index.css (Estilos limpos e moderno para a tela login e cadastro)
| | └──painel.css (Estilos limpos e moderno para acessar as outras interfaces)
│ └── js/
│ └── index.js (logicas para a tela de login e cadastro)
└── src/ (Seu backend em Node.js / Express)

index.html (Darlan Workspace) -> A pessoa entra, faz login ou cadastra.
painel.html (Darlan Workspace) -> O "cardápio" ou launcher com os cards bonitos para ela escolher qual ferramenta quer abrir.
lombada.html e pdf.html (As ferramentas em si) -> A pessoa clica no card, vai para a página específica da ferramenta, preenche os dados e o backend processa tudo em segurança.

meu-projeto/
├── node_modules
├── public/ # Seu front-end unificado (HTML, CSS modular, JS)
├── src/
│ ├── config/ # Conexão com banco de dados
│ ├── controllers/ # Lógica de Login, Cadastro, Aprovação
│ ├── middlewares/ # Validação de JWT e verificação se está ativo/aprovado
│ ├── routes/ # Rotas da API (Auth, Calculadora, Admin)
│ └── services/ # Integração com o Bot do Telegram
├── package-lock.json
├── package.json
├── server.js
└── README.md
