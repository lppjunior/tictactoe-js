import { PLAYER } from '../tictactoe/constants'

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

function getAvailableMoves (board) {
  return board.reduce((moves, cell, index) => {
    if (cell === '') moves.push(index)
    return moves
  }, [])
}

function getWinner (board) {
  const line = WINNING_LINES.find(([first, second, third]) => (
    board[first] !== '' &&
    board[first] === board[second] &&
    board[first] === board[third]
  ))

  return line ? board[line[0]] : null
}

function findWinningMove (board, player) {
  return getAvailableMoves(board).find((position) => {
    board[position] = player
    const wins = getWinner(board) === player
    board[position] = ''
    return wins
  })
}

function chooseRandom (moves, random) {
  const index = Math.min(moves.length - 1, Math.floor(random() * moves.length))
  return moves[Math.max(0, index)]
}

function minimax (board, currentPlayer, player, depth) {
  const winner = getWinner(board)
  if (winner === player) return 10 - depth
  if (winner !== null) return depth - 10

  const moves = getAvailableMoves(board)
  if (moves.length === 0) return 0

  const opponent = player === PLAYER.X ? PLAYER.O : PLAYER.X
  const nextPlayer = currentPlayer === player ? opponent : player
  const scores = moves.map((position) => {
    board[position] = currentPlayer
    const score = minimax(board, nextPlayer, player, depth + 1)
    board[position] = ''
    return score
  })

  return currentPlayer === player ? Math.max(...scores) : Math.min(...scores)
}

export default function chooseMove (
  board,
  player = PLAYER.O,
  difficulty = 'medium',
  random = Math.random
) {
  if (!Array.isArray(board) || board.length !== 9 || board.some((cell) => !['', PLAYER.X, PLAYER.O].includes(cell))) {
    throw new TypeError('The bot expects a flat 3x3 board.')
  }
  if (![PLAYER.X, PLAYER.O].includes(player)) {
    throw new TypeError('The bot player must be X or O.')
  }

  const moves = getAvailableMoves(board)
  if (moves.length === 0) return -1
  if (difficulty === 'easy') return chooseRandom(moves, random)

  const winningMove = findWinningMove(board, player)
  if (winningMove !== undefined) return winningMove

  if (difficulty !== 'hard') {
    const opponent = player === PLAYER.X ? PLAYER.O : PLAYER.X
    const blockingMove = findWinningMove(board, opponent)
    return blockingMove !== undefined ? blockingMove : chooseRandom(moves, random)
  }

  const opponent = player === PLAYER.X ? PLAYER.O : PLAYER.X
  let bestScore = -Infinity
  let bestMoves = []

  moves.forEach((position) => {
    board[position] = player
    const score = minimax(board, opponent, player, 1)
    board[position] = ''

    if (score > bestScore) {
      bestScore = score
      bestMoves = [position]
    } else if (score === bestScore) {
      bestMoves.push(position)
    }
  })

  return chooseRandom(bestMoves, random)
}
