
/**
 * Privated class
 * Defines the intelligence of all bot players
 *
 *
 * @this {TictactoeBot}
 *
 */
class TictactoeBot {
  /**
   * Easy BOT
   * Find a position to play from Random number
   *
   * @param {array} board Current game board
   * @param {int} Current turn
   * @param {function} play Function to execute after select a position
   *
   **/
  static easy (board, play) {
    let item
    do {
      item = Math.floor(Math.random() * 9)
    } while (board[item] !== Tictactoe.NONE)

    play(item)
  }

  /**
   * Medium BOT
   * Verify win or loose position and play
   * After verification, play on easy mode
   *
   * @param {array} board Current game board
   * @param {int} turn Current turn
   * @param {function} play Function to execute after select a position
   *
   **/
  static medium (board, turn, play) {
    if (TictactoeBot.playWinLose(board, turn, play)) {
      return
    }

    TictactoeBot.easy(board, turn, play)
  }

  /**
   * Hard BOT
   * Play game using strategy according to the game position
   *
   * @param {array} board Current game board
   * @param {int} turn Current turn
   * @param {function} play Function to execute after select a position
   * @param {int} Sum position of game play
   *
   **/
  static hard (board, turn, play, gamePos) {
    if (TictactoeBot.playWinLose(board, turn, play)) {
      return
    }

    let item = -1
    if (gamePos === 1) {
      if (board[4] === Tictactoe.NONE) {
        item = 4
      } else {
        item = 0
      }
    } else if (gamePos === 2) {
      const itens = [0, 2, 6, 8]
      for (const i in itens) {
        if (board[i] === Tictactoe.NONE) {
          item = itens[i]
          break
        }
      }
    } else if (gamePos === 3) {
      const itens = (board[7] === TictactoeBot.opponent())
        ? [5, 3, 1, 7]
        : [1, 3, 5, 7]
      for (const i in itens) {
        if (board[itens[i]] === Tictactoe.NONE) {
          item = itens[i]
          break
        }
      }
    }

    if (item >= 0) {
      play(item)
    } else {
      TictactoeBot.medium(board, turn, play)
    }
  }

  /**
   * Verify a position to win the game and check
   * Verify a position to loose the game and check
   *
   * @param {array} board Current game board
   * @param {int} turn Current turn
   * @param {function} play Function to execute after select a position
   * @return {boolean} True if is checked or false if not is checked
   *
   **/
  static playWinLose (board, turn, play) {
    const victoryPos = TictactoeBot.getVictoryPos(board, turn)
    if (victoryPos > -1) {
      play(victoryPos)
      return true
    }

    const loosePos = TictactoeBot.getLoosePos(board, turn)
    if (loosePos > -1) {
      play(loosePos)
      return true
    }

    return false
  }

  /**
   * Return position of loose game
   *
   * @param {array} board Current game board
   * @param {int} turn Current turn
   *
   **/
  static getLoosePos (board, turn) {
    const opponent = TictactoeBot.opponent(turn)
    return TictactoeBot.getVictoryPos(board, opponent)
  }

  /**
   * Return winner position of USER turn
   *
   * @param {int} turn Define the current player
   * @return {int} Returns opponent player
   *
   */
  static getVictoryPos (board, turn) {
    for (const victory in VICTORY) {
      let count = 0
      let victoryPos = -1

      for (const pos in VICTORY[victory]) {
        if (board[VICTORY[victory][pos]] === turn) {
          count++
        } else {
          victoryPos = VICTORY[victory][pos]
        }
      }

      if (count === 2 && board[victoryPos] === Tictactoe.NONE) {
        return victoryPos
      }
    }

    return -1
  }

  /**
   * Returns the opponent player
   *
   * @param {turn} Constant that defines the current player
   * @return {int} Returns opponent player
   *
   */
  static opponent (turn) {
    return (turn === Tictactoe.CIRCLE)
      ? Tictactoe.CROSS
      : Tictactoe.CIRCLE
  }
}

export default TictactoeBot