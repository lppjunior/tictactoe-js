# Jogo da Velha

Jogo web de três em linha feito com React e Vite. É possível jogar em dupla ou contra o robô, com níveis fácil, médio e difícil.

## Executar localmente

```bash
npm install
npm run dev
```

## Partidas

O painel inicial serve para configurar e abrir partidas e ocupa a primeira posição da grade. Cada partida tem seu próprio tabuleiro e placar; as mais recentes aparecem antes das anteriores. Não há página de estatísticas nem ação de nova rodada.

## Pacotes

- `projects/main` (`@tictactoe/main`): regras, estado e eventos.
- `projects/bot` (`@tictactoe/bot`): jogadas do robô.
- `projects/game` (`@tictactoe/game`): interface React e integração GTM.

## Google Tag Manager

Copie `projects/game/.env.example` para `projects/game/.env` para ativar o GTM localmente. No provedor de deploy, configure `VITE_GTM_ID=GTM-KMTQTFL` antes do build. O identificador é público e incluído no HTML. O build exige um identificador válido; no servidor de desenvolvimento, sem ele, o GTM fica desativado e um aviso é exibido.

## Acessibilidade

Controles nativos de teclado, rótulos acessíveis para cada casa, anúncio de atualizações da partida para leitores de tela, foco visível e suporte à preferência por movimento reduzido.

## Verificações

```bash
npm test
npm run lint
npm run build
```

## Licença

[MIT License](./LICENSE.md) © [Luiz Paulo](https://lppjunior.com/)
