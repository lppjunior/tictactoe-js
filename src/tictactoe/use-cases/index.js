import { PLAYER, STATUS } from '../constants'

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export function play (position) {
  if (!this.state) return false

  const state = this.getState()
  const { rows, cols, board } = state

  if (
    state.status !== STATUS.PLAYING ||
    !Number.isInteger(position) ||
    position < 0 ||
    position >= rows * cols
  ) return false

  const row = Math.floor(position / cols)
  const col = position % cols
  if (board[row][col] !== '') return false

  const symbol = state.currentPlayer === 0 ? PLAYER.X : PLAYER.O
  this.state.setValue(row, col, symbol)
  this.state.set('checked', state.checked + 1)
  this.state.set('lastUpdate', { position, row, col, symbol })
  this.nextTurn()

  return true
}

export function updateStatus () {
  const state = this.getState()
  const line = WINNING_LINES.find((positions) => {
    const firstRow = Math.floor(positions[0] / state.cols)
    const firstCol = positions[0] % state.cols
    const symbol = state.board[firstRow][firstCol]

    if (symbol === '') return false

    return positions.every((position) => {
      const row = Math.floor(position / state.cols)
      const col = position % state.cols
      return state.board[row][col] === symbol
    })
  })

  if (line) {
    const row = Math.floor(line[0] / state.cols)
    const col = line[0] % state.cols
    this.state.set('status', STATUS.FINISHED)
    this.state.set('winner', state.board[row][col])
    this.state.set('winningLine', line)
  } else if (state.checked === state.rows * state.cols) {
    this.state.set('status', STATUS.FINISHED)
    this.state.set('winner', null)
    this.state.set('winningLine', [])
  }
}

export function nextPlayer () {
  const state = this.getState()
  this.state.set('currentPlayer', (state.currentPlayer + 1) % state.playersAmount)
}
