🎮 Jogo da Velha com React

Uma aplicação web desenvolvida com React + Vite que recria o clássico jogo da velha com uma interface moderna, responsiva e interativa. O projeto permite partidas locais entre dois jogadores ou contra uma inteligência artificial com múltiplos níveis de dificuldade, demonstrando na prática conceitos fundamentais de front-end.

🚀 Acesse o projeto

https://tab-news-jogo-da-velha.vercel.app

🖼️ Preview da aplicação

📌 Dica: aqui você pode colocar um print do seu projeto
Exemplo de nome do arquivo: preview.png

![Preview do projeto](./preview.png)
📌 Visão geral

Este projeto foi desenvolvido com foco em componentização, gerenciamento de estado e lógica de jogo utilizando React.

A aplicação permite que o usuário escolha o modo de jogo, selecione seu símbolo e acompanhe o placar em tempo real, com uma experiência fluida e intuitiva.

📂 Estrutura do projeto

A estrutura segue o padrão moderno de aplicações React com Vite:

Tab-news-jogo-da-velha/
├── public/                # Arquivos públicos (assets)
├── src/                   # Código principal da aplicação
│   ├── App.jsx            # Lógica do jogo e renderização principal
│   ├── main.jsx           # Entrada da aplicação React
│   ├── App.css            # Estilos do jogo
│   └── index.css          # Estilos globais
├── index.html             # Template base
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
└── README.md              # Documentação
🧠 Arquivos importantes
main.jsx → inicializa a aplicação React e conecta ao DOM
App.jsx → contém toda a lógica do jogo (estado, jogadas, IA, vitória)
App.css / index.css → responsáveis pela interface e responsividade
package.json → define dependências e scripts do projeto
vite.config.js → configura o ambiente de build
✨ Funcionalidades
jogo da velha interativo
modo 2 jogadores local
modo jogador vs IA
níveis de dificuldade (fácil, médio, difícil)
escolha de símbolo (X ou O)
detecção automática de vitória ou empate
placar atualizado em tempo real
reinício de partidas e navegação simples
🤖 Inteligência Artificial

A IA foi implementada com níveis progressivos:

Fácil → jogadas aleatórias
Médio → bloqueia jogadas e tenta vencer
Difícil → comportamento estratégico mais avançado

Isso permite diferentes níveis de desafio para o usuário.

🛠️ Tecnologias utilizadas
React
Vite
JavaScript
CSS
React DOM
▶️ Como executar
git clone https://github.com/Jaosuzart/Tab-news-jogo-da-velha.git
cd Tab-news-jogo-da-velha
npm install
npm run dev
Build de produção:
npm run build
npm run preview
💡 Diferenciais
estrutura organizada e escalável
aplicação real com lógica completa de jogo
uso prático de React (estado + renderização)
múltiplos modos de jogo
código limpo e fácil de manter
João Suzart

https://github.com/Jaosuzart

⭐ Apoie o projeto
Se esse projeto te ajudou ou você achou interessante, deixe uma ⭐ no repositório!
