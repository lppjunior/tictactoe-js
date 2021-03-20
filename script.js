let count = 0
function makeInstance (enemy) {
  count++
  const id = 'tictactoe' + count

  const { USER, COMPUTER_EASY, COMPUTER_MEDIUM, COMPUTER_HARD } = Tictactoe

  let desc
  switch (enemy) {
    case USER: desc = 'Usuário'; break
    case COMPUTER_EASY: desc = 'Computador fácil'; break
    case COMPUTER_MEDIUM: desc = 'Computador médio'; break
    case COMPUTER_HARD: desc = 'Computador difícil'; break
  }

  jQuery('.form').before(`
    <div class="box">
		  <div class="description">Usuário x ${desc}</div>
      <div id="${id}"></div>
    </div>`
  )

  const game = new Tictactoe({
    target: '#' + id,
    enemy: enemy
  })

  game.start()
  resize()
}

function resize () {
  const length = jQuery('.box').length
  const size = jQuery('.box').outerWidth() * length + (50 * length)
  jQuery('body').width(size)
  $('body, html').scrollLeft(size)
}

jQuery(document).ready(() => {
  jQuery('#makeInstance').submit(function () {
    try {
      let enemy = Tictactoe.USER

      if (this.enemy.value == 'computer') {
        switch (this.level.value) {
          case 'easy': enemy = Tictactoe.COMPUTER_EASY; break
          case 'medium': enemy = Tictactoe.COMPUTER_MEDIUM; break
          case 'hard': enemy = Tictactoe.COMPUTER_HARD; break
        }
      }

      makeInstance(enemy)
    } catch (e) {
      console.log(e.message)
    }

    return false
  })
})
