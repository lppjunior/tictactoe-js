const checkSequence = (board, sequence) => (
  sequence
    .map(({ row, col }) => board[row][col])
    .every((val, _, array) => val === array[0])
)

const checker = ({ board, cols, rows, sequenceToWin, row, col }) => {
  const check = {
    column: (row, col) => {
      if (sequenceToWin + row <= rows) {
        const sequence = Array(sequenceToWin).fill('').map((v, i) => (
          { row: row + i, col }
        ))

        if (checkSequence(board, sequence)) return sequence
      }

      return null
    },

    row: (row, col) => {
      if (sequenceToWin + col <= cols) {
        const sequence = Array(sequenceToWin).fill('').map((v, i) => (
          { row, col: col + i }
        ))

        if (checkSequence(board, sequence)) return sequence
      }
      return null
    },

    diagonaPositive: (row, col) => {
      if (row + sequenceToWin <= rows && col + sequenceToWin <= cols) {
        const sequence = Array(sequenceToWin).fill('').map((v, i) => (
          { row: row + i, col: col + i }
        ))

        if (checkSequence(board, sequence)) return sequence
      }
      return null
    },

    diagonaNegative: (row, col) => {
      if (row + sequenceToWin <= rows && col - sequenceToWin + 1 >= 0) {
        const sequence = Array(sequenceToWin).fill('').map((v, i) => (
          { row: row + i, col: col - i }
        ))

        if (checkSequence(board, sequence)) return sequence
      }
      return null
    }
  }

  let win = check.column(row, col)
  if (!win) win = check.row(row, col)
  if (!win) win = check.diagonaPositive(row, col)
  if (!win) win = check.diagonaNegative(row, col)

  return win
}

export default checker
