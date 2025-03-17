/**
 * Privated class
 * Control DOM interface components
 *
 * @this {TictactoeView}
 */

const DESC = {
  USER: 'Usuário',
  EASY_BOT: 'Robô fácil',
  MEDIUM_BOT: 'Robô médio',
  HARD_BOT: 'Robô difícil'
}

const STYLES = [
  'circle',
  'cross'
]

class TictactoeView {
  /**
	 * @constructor
	 * @param {config} Define all configurations
	 **/
  constructor({ game, id, player1, player2 }) {
    this.game = game
    this.id = id
    this.player1 = player1
    this.player2 = player2

    game
      .on(this.game.EVENT.START, () => { this.render() })
      .on(this.game.EVENT.UPDATE, (data) => { this.update(data.state.board) })
      // .on(this.game.EVENT.NEXT_TURN, (data) => { this.update(data.state.board) })
      .on(this.game.EVENT.FINISH, (data) => { this.finishGame(data) })
  }

  makeBox() {
    const newNode = `
      <div class="box">
        <div class="description">${DESC[this.player1]} x ${DESC[this.player2]}</div>
        <div id="${this.id}"></div>
      </div>`
    document.getElementsByClassName('form')[0].insertAdjacentHTML('beforebegin', newNode);

    return document.getElementById(this.id)
  }

  /**
	 * Render a HTML structure into target DOM object
	 *
	 **/
  render() {
    this.target = this.makeBox()

    this.target.innerHTML = `
		<table summary="grid">
			<tbody>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>`

    this.initEvents()
  }

  /**
	 * Define events to column itens
	 *
	 **/
  initEvents() {
    this.itens = this.target.querySelectorAll('td')
    for (let i = 0; i < this.itens.length; i++) {
      this.itens[i].tictactoePosition = i
      this.itens[i].onclick = (e) => { this.click(e) }
    }
  }

  /**
	 * Execited on item click
	 *
	 * @param {Event} e Event from object clicked
	 *
	 **/
  click(e) {
    this.game.check(e.currentTarget.tictactoePosition)
    // jQuery(this.target).trigger('play', [position])
  }

  /**
	 * Executed when Trigger 'update' is called
	 * Change style from checked item
	 *
	 * @param {array} board Current game board
	 *
	 **/
  update(board) {
    console.log('===> ', this.id)
    board.forEach((row, i) => {
      row.forEach((value, j) => {
        const pos = i * this.game.options.cols + j
        if (value === '') return
        this.itens[pos].setAttribute('class', STYLES[value])
      })
    })
  }

  /**
	 * Executed when Trigger 'finish' is called
	 * Change style from checked item
	 *
	 * @param {array} board Current game board
	 *
	 **/
  finishGame(data) {
    const newLocal = 'victory'

    data.state.winnerPos.forEach((coord) => {
      const pos = coord.row * this.game.options.cols + coord.col
      this.itens[pos].classList.add(newLocal)
    })

    let desc = ''

    if (data.state.winner === 0) {
      if (this.player1 === 'USER') {
        desc = 'Usuário 1 ganhou'
      } else {
        desc = 'Robô 1 ganhou'
      }
    } else {
      if (this.player2 === 'USER') {
        desc = 'Usuário 2 ganhou'
      } else {
        desc = 'Robô 2 ganhou'
      }
    }

    this.target.insertAdjacentHTML('afterbegin', '<div class="winner opaque">' + desc + '</div>')

    setTimeout(() => {
      this.target.addEventListener("click", () => {
        this.target.parentNode.remove()
      })
    }, 200)
  }
}


export default TictactoeView