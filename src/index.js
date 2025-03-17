// import { ENEMY_LEVEL } from './bot/enemy_level'
import Tictactoe from './engine'
import Tictactoeboard from './TictactoeBoard'

import './scss/global.scss';

let count = 0
function makeInstance(player1, player2) {

  count++
  const game = new Tictactoe()
  new Tictactoeboard({
    game,
    id: `tictactoe-${count}`,
    player1,
    player2
  })

  game.start()

}

document.addEventListener('DOMContentLoaded', () => {
  const makeInstanceForm = document.getElementById('makeInstance')

  makeInstanceForm.onsubmit = function () {
    try {
      makeInstance(this.user_1.value, this.user_2.value)
    } catch (e) {
      console.log(e.message)
    }

    return false
  }

  makeInstanceForm.onsubmit()
})