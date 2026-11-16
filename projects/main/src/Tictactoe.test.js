import { Tictactoe } from './index'
import { EVENT, PLAYER, STATUS } from './constants'

function playMoves (game, moves) {
  moves.forEach((position) => {
    expect(game.play(position)).toBe(true)
  })
}

describe('Tictactoe', () => {
  test('starts with an empty board and announces the start', () => {
    const listener = jest.fn()
    const game = new Tictactoe()
      .addListener(EVENT.START, listener)
      .start()

    expect(game.getState()).toMatchObject({
      rows: 3,
      cols: 3,
      playersAmount: 2,
      checked: 0,
      currentPlayer: 0,
      status: STATUS.PLAYING,
      winner: null,
      winningLine: [],
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]
    })
    expect(listener).toHaveBeenCalledWith(game.getState())
  })

  test('plays a valid move, changes turns, and emits the turn event', () => {
    const listener = jest.fn()
    const game = new Tictactoe().addListener(EVENT.NEXT_TURN, listener).start()

    expect(game.play(4)).toBe(true)
    expect(game.getState()).toMatchObject({
      checked: 1,
      currentPlayer: 1,
      lastUpdate: { position: 4, row: 1, col: 1, symbol: PLAYER.X },
      board: [
        ['', '', ''],
        ['', PLAYER.X, ''],
        ['', '', '']
      ]
    })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('rejects invalid moves, occupied cells, and moves before start', () => {
    const game = new Tictactoe()

    expect(game.play(0)).toBe(false)

    game.start()
    ;[-1, 9, 1.5, '0'].forEach((position) => {
      expect(game.play(position)).toBe(false)
    })
    expect(game.play(0)).toBe(true)
    expect(game.play(0)).toBe(false)
    expect(game.getState().checked).toBe(1)
  })

  test.each([
    [[0, 3, 1, 4, 2], PLAYER.X, [0, 1, 2]],
    [[0, 1, 2, 4, 3, 7], PLAYER.O, [1, 4, 7]],
    [[0, 1, 4, 2, 8], PLAYER.X, [0, 4, 8]]
  ])('detects a win for %s', (moves, winner, winningLine) => {
    const finishListener = jest.fn()
    const game = new Tictactoe().addListener(EVENT.FINISH, finishListener).start()

    playMoves(game, moves)

    expect(game.getState()).toMatchObject({
      status: STATUS.FINISHED,
      winner,
      winningLine
    })
    expect(finishListener).toHaveBeenCalledTimes(1)
    expect(game.play(6)).toBe(false)
  })

  test('detects a draw and resets cleanly when started again', () => {
    const game = new Tictactoe().start()

    playMoves(game, [0, 1, 2, 4, 3, 5, 7, 6, 8])

    expect(game.getState()).toMatchObject({
      checked: 9,
      status: STATUS.FINISHED,
      winner: null,
      winningLine: []
    })

    game.start()
    expect(game.getState().checked).toBe(0)
    expect(game.getState().status).toBe(STATUS.PLAYING)
  })
})
