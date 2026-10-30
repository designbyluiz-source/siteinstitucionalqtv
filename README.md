# Quantum Tech Ventures

Landing page institucional em português. A versão atual usa a composição da Clutch Security como referência visual: fundo branco, títulos pretos e cinza, margens delimitadas por linhas finas, ilustração de marca metálica com discos em órbita, seções alternadas e abas horizontais.

O conteúdo usa o material de marca fornecido e a LP https://qtvholding.com: apresentação, cinco cases (MesaOTC, Rawgates, Gates2b, GlobalDex e VerticoSys), origem em Curitiba em 2017 e história de expansão internacional. Os dados corporativos e contatos são os fornecidos pelo usuário. Não foram reproduzidos contadores ou números inconsistentes da LP anterior.

## Prévia local

Execute `python3 -m http.server 4173 --directory dist` nesta pasta e abra `http://localhost:4173`.

## Arquivos

- `dist/index.html`: conteúdo e estrutura.
- `dist/styles.css`: identidade visual e layouts responsivos.
- `dist/app.js`: menu móvel, abas de soluções e cases, navegação por teclado.
- `dist/assets/`: símbolos oficiais, logos dos cases, ilustrações vetoriais e imagem 3D.
- `.openai/hosting.json`: identidade e configuração do Site privado existente.

Os botões de contato abrem o aplicativo de e-mail do visitante para contato@qtvholding.com. Cada solução inclui assunto específico. O LinkedIn aponta para a página informada pelo usuário. Não há coleta de dados ou envios simulados.

Inter é carregada do Google Fonts com alternativas locais. A página funciona sem instalação ou compilação.

## Imagem 3D

Arquivo final: `dist/assets/quantum-hero-3d.png`. Criado com a ferramenta Imagegen integrada, usando o símbolo oficial como referência de forma e a Clutch como referência de composição. Prompt resumido: render de estúdio em fundo branco, monograma QT extrudado em prata e grafite, discos pretos com símbolos financeiros em órbitas elípticas, dois detalhes dourados, sombras difusas, sem textos ou interface. Sem uso de API ou CLI externa de geração.

## Verificação

Conferidos no navegador: desktop e celular, menu, abas de cases e soluções, assuntos dos contatos, imagens, destinos de âncoras e navegação por teclado. Sem erros no console e sem rolagem lateral nas dimensões verificadas.

## Animação e integridade da marca

A marca central usa o contorno completo do SVG oficial extrudado em 3D. Não há cortes, divisões ou movimentos de partes isoladas. O símbolo inteiro flutua e gira suavemente como uma única peça. Os discos permanecem fixos e alternam grupos de cor em sincronia com o título. A cena pausa fora da tela e em segundo plano, respeita a preferência de redução de movimento e mantém a imagem estática como alternativa se WebGL não estiver disponível.

Para reconstruir o módulo 3D: `npm ci` e `npm run build`.

## Ilustrações de soluções

`src/illustrations.js` renderiza três cenas independentes: cartões completos com chip, moedas sólidas e um globo com continentes e órbita contínua. As animações pausam fora da tela e em segundo plano, e respeitam a preferência de redução de movimento. Imagens equivalentes em `dist/assets/payment-cards.jpg`, `digital-coins.jpg` e `global-globe.jpg` são usadas se 3D estiver indisponível.

O módulo compartilha a biblioteca Three.js com a hero pelo empacotamento de `build.mjs`. A hero mantém sua implementação existente. Dados de continentes: Natural Earth, domínio público, https://www.naturalearthdata.com/about/terms-of-use/.
