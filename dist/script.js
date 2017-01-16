let count = 0;
function makeInstance(enemy) {
	count++;
	let id = "tictactoe" + count;

	let desc;
	switch(enemy) {
		case Tictactoe.USER: desc = "Usuário"; break;
		case Tictactoe.COMPUTER_EASY: desc = "Computador fácil"; break;
		case Tictactoe.COMPUTER_MEDIUM: desc = "Computador médio"; break;
		case Tictactoe.COMPUTER_HARD: desc = "Computador difícil"; break;
	}

	jQuery(".form").before('<div class="box">\
		<div class="description">Usuário x ' + desc + '</div>\
								<div id="' + id + '"></div>\
							</div>');

	let game = new Tictactoe({
		'target': "#" + id,
		'enemy': enemy
	});

	game.start();
	resize();
}

function resize() {
	let length = jQuery(".box").length;
	let size = jQuery(".box").outerWidth() * length + (50 * length);
	jQuery("body").width(size);
	$('body, html').scrollLeft(size);
}

jQuery(document).ready(() => {
	jQuery("#makeInstance").submit(function () {
		try {
			let enemy = Tictactoe.USER;
			
			if(this.enemy.value == 'computer') {
				switch(this.level.value) {
					case 'easy': enemy = Tictactoe.COMPUTER_EASY; break;
					case 'medium': enemy = Tictactoe.COMPUTER_MEDIUM; break;
					case 'hard': enemy = Tictactoe.COMPUTER_HARD; break;
				}
			}
			
			makeInstance(enemy);
		} catch (e) {
			console.log(e.message);
		}

		return false;
	});
});