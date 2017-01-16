/**
 * Privated class
 * Control DOM interface components
 * 
 * @this {TictactoeView}
 */
class TictactoeView {
	
	/**
	 * @constructor
	 * @param {config} Define all configurations
	 **/
	constructor(game) {
		this.target = game.target;
		game
			.on("update", (e, data) => { this.update(data); })
			.on("finish", (e, winner, position) => { 
								this.finishGame(winner, position);
						}
					);
	}

	/**
	 * Render a HTML structure into target DOM object
	 * 
	 **/
	render() {

		this.target.html('\
		<table summary="grid">\
			<tbody>\
				<tr>\
					<td></td>\
					<td></td>\
					<td></td>\
				</tr>\
				<tr>\
					<td></td>\
					<td></td>\
					<td></td>\
				</tr>\
				<tr>\
					<td></td>\
					<td></td>\
					<td></td>\
				</tr>\
			</tbody>\
		</table>');

		this.initEvents();
	}

	/**
	 * Define events to column itens
	 * 
	 **/
	initEvents() {
		let that = this;
		this.itens = this.target.find("td");
		this.itens.click((e) => { this.click(e); });
	}

	/**
	 * Execited on item click
	 * 
	 * @param {Event} e Event from object clicked
	 * 
	 **/
	click(e) {
		let target   = jQuery(e.target);
		let position = this.itens.index(target);
		jQuery(this.target).trigger("play", [position]);
	}

	/**
	 * Executed when Trigger 'update' is called
	 * Change style from checked item
	 * 
	 * @param {array} board Current game board
	 * 
	 **/
	update(board) {
		for(let pos in board) {
			let style = "";
			switch(board[pos]) {
				case Tictactoe.CIRCLE: 
					style = "circle";
					break;
				case Tictactoe.CROSS:
					style = "cross"; 
					break;
			}

			let td = this.itens.get(pos);
			jQuery(td).attr("class", style);
		}
	}

	/**
	 * Executed when Trigger 'finish' is called
	 * Change style from checked item
	 * 
	 * @param {array} board Current game board
	 * 
	 **/
	finishGame(winner, position) {
		for(let pos in position) {
			let td = this.itens.get(position[pos]);
			jQuery(td).addClass("victory");
		}

		let desc = "";
		switch(winner) {
			case Tictactoe.NONE: desc = "Deu velha"; break;
			case Tictactoe.USER: desc = "Usuário ganhou"; break;
			default: desc = "Computador ganhou"; break;
		}

		let div = jQuery('<div class="winner opaque">' + desc + '</div>').click((e) => { this.target.parent(".box").remove(); });
		this.target.parent().append(div);

	}
}