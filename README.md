# Jogo da velha

Implementação do famoso jogo da velha utilizando jQuery.
Essa versão permite criação de várias instancias do jogo em uma mesma tela.

## Instalando pacotes

Antes de executar o jogo, é necessário instalar os módulos dependentes utilizando a ferramenta npm.

`$ npm install`

## Constante

```
#Tipo de usuário.
#Será utilizado ao instanciar o jogo

Tictactoe.USER;
Tictactoe.COMPUTER_EASY;
Tictactoe.COMPUTER_MEDIUM;
Tictactoe.COMPUTER_HARD;
```

## Parâmetros de configuração
De todos os parâmetros citados abaixo, apenas o 'target' é obrigatório.
```
{
	'target': object, //Objeto DOM que receberá o jogo
	'enemy': int,     //Constante que define o usuário
	'view': class     //Classe que controlará a interface do jogo
}
```

## Criando uma instância do jogo

```
let enemy = Tictactoe.COMPUTER_HARD;
let target = "#game_div";
let game = new Tictactoe({
	'target': target,
	'enemy': enemy
});

game.start();
```

## Exemplo
Veja um exemplo de implementação do jogo no arquivo [sample.html](https://github.com/lppjunior/tictactoe/blob/master/sample.html)

## Licença

[MIT License](https://github.com/lppjunior/tictactoe/LICENSE.md) © [Luiz Paulo](http://lppjunior.com/)
