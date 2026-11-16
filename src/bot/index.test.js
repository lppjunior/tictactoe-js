import { Bot } from '../index'
import { PLAYER } from '../tictactoe/constants'

const EMPTY_BOARD = ['', '', '', '', '', '', '', '', '']

describe('Bot', () => {
  test('chooses a random open cell in easy mode', () => {
    expect(Bot(EMPTY_BOARD, PLAYER.O, 'easy', () => 0.99)).toBe(8)
  })

  test('takes an available winning move in medium mode', () => {
    const board = [PLAYER.O, PLAYER.O, '', PLAYER.X, '', '', PLAYER.X, '', '']

    expect(Bot(board, PLAYER.O, 'medium')).toBe(2)
    expect(board).toEqual([PLAYER.O, PLAYER.O, '', PLAYER.X, '', '', PLAYER.X, '', ''])
  })

  test('blocks the opponent and falls back to a legal move', () => {
    const blockingBoard = [PLAYER.X, PLAYER.X, '', '', PLAYER.O, '', '', '', '']
    const fallbackBoard = [PLAYER.X, '', '', '', PLAYER.O, '', '', '', '']

    expect(Bot(blockingBoard, PLAYER.O, 'medium')).toBe(2)
    expect(Bot(fallbackBoard, PLAYER.O, 'medium', () => 0)).toBe(1)
    expect(Bot(EMPTY_BOARD, PLAYER.X, 'medium', () => 0)).toBe(0)
  })

  test('uses minimax to take an immediate win and block a forced loss', () => {
    const winningBoard = [PLAYER.O, PLAYER.O, '', PLAYER.X, '', '', PLAYER.X, '', '']
    const blockingBoard = [PLAYER.X, PLAYER.X, '', PLAYER.O, '', '', PLAYER.O, '', '']

    expect(Bot(winningBoard, PLAYER.O, 'hard')).toBe(2)
    expect(Bot(blockingBoard, PLAYER.O, 'hard', () => 0)).toBe(2)
  })

  test('uses minimax to choose a move when there is no immediate win', () => {
    const board = [...EMPTY_BOARD]
    const move = Bot(board, PLAYER.O, 'hard', () => 0)
    const moveAsX = Bot(board, PLAYER.X, 'hard', () => 0)

    expect(move).toBeGreaterThanOrEqual(0)
    expect(move).toBeLessThan(9)
    expect(moveAsX).toBeGreaterThanOrEqual(0)
    expect(moveAsX).toBeLessThan(9)
    expect(board).toEqual(EMPTY_BOARD)
  })

  test('returns no move for a full board', () => {
    expect(Bot([PLAYER.X, PLAYER.O, PLAYER.X, PLAYER.X, PLAYER.O, PLAYER.O, PLAYER.O, PLAYER.X, PLAYER.X])).toBe(-1)
  })

  test('rejects invalid boards and symbols', () => {
    expect(() => Bot(null)).toThrow(TypeError)
    expect(() => Bot(['X'])).toThrow(TypeError)
    expect(() => Bot([null, ...EMPTY_BOARD.slice(1)])).toThrow(TypeError)
    expect(() => Bot(EMPTY_BOARD, 'A')).toThrow(TypeError)
  })
})
