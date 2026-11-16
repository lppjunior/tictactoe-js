import { STATUS } from './constants'

class State {
  constructor (options) {
    this.options = {
      rows: 3,
      cols: 3,
      players: 2,
      ...options
    }

    this.init()
  }

  init () {
    this.constants = {
      rows: this.options.rows,
      cols: this.options.cols,
      toFill: this.options.cols * this.options.rows,
      playersAmount: this.options.players
    }

    this.state = {
      checked: 0,
      currentPlayer: 0,
      status: STATUS.PLAYING,
      winner: null,
      winningLine: [],
      lastUpdate: null,
      board: Array(this.options.rows).fill(null)
        .map(() => Array(this.options.cols).fill(''))
    }
  }

  get (key) {
    return key
      ? this.state[key]
      : { ...this.constants, ...this.state }
  }

  set (key, value) {
    this.state[key] = value
  }

  getValue (row, col) {
    return this.state.board[row][col]
  }

  setValue (row, col, value) {
    this.state.board[row][col] = value
  }
}

export default State
