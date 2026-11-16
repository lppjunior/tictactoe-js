# Jogo da Velha

Jogo web de três em linha feito com React e Vite. É possível jogar em dupla ou contra o robô, com níveis fácil, médio e difícil.

## Executar localmente

```bash
npm install
npm run dev
```

## Partidas

O painel inicial serve para configurar e abrir partidas. Cada partida tem seu próprio tabuleiro e placar; abra outra pelo mesmo painel para jogar em paralelo. Não há página de estatísticas nem ação de nova rodada.

## Google Tag Manager

Copie `.env.example` para `.env` para ativar o GTM localmente. No provedor de deploy, configure `VITE_GTM_ID=GTM-KMTQTFL` antes do build. O identificador é público e incluído no HTML. O build exige um identificador válido; no servidor de desenvolvimento, sem ele, o GTM fica desativado e um aviso é exibido.

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
