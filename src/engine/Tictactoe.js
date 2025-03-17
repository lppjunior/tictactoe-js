/*
 * Tictactoe-js - 2023-02-23
 *     @see: http://en.wikipedia.org/wiki/Tictactoe
 *			 http://pt.wikipedia.org/wiki/Jogo_da_velha
 *
 * Copyright (c) 2023 Luiz Paulo
 * Site: http://lppjunior.com
 *
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Tictactoe game
 *
 * @author Luiz Paulo <lppjunior@gmail.com>
 **/
import { Observer } from '@lppjunior/pattern-js'

// import * as UseCases from '../use-cases'
import STATUS from './status'
import EVENT from './event'
import checker from './checker'

// Define default configurations
const DEFAULT_OPTIONS = {
  rows: 3,
  cols: 3,
  sequenceToWin: 3,
  toFill: 9,
  players: 2
}

class Tictactoe {
  constructor(options) {
    this.observer = new Observer()

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
  }

  start() {
    this.emit(EVENT.START)

    this.state = {
        checkedSum: 0,
        currentPlayer: 0,
        status: STATUS.PLAYING,
        winner: null,
        winnerPos: [],
        board: Array(this.options.rows).fill(null)
          .map(() => Array(this.options.cols).fill(''))
      }

      this.history = []

    return this
  }

  on(event, fn) {
    this.observer.on(event, fn)

    return this
  }

  emit(event) {
    const state = this.getState()
    const history = this.getHistory()
    const data = { event, state, history }

    this.observer.emit(event, data)
    this.observer.emit(EVENT.ALL, data)
  }

  getState() {
    return this.state
  }
  getHistory() {
    return this.history
  }

  check(pos) {
    const row = parseInt(pos / this.options.cols)
    const col = pos - this.options.cols * row

    if (this.state.board[row][col] !== '') {
      return
    }

    this.state.board[row][col] = this.state.currentPlayer
    this.state.checkedSum++
    this.history.push({ user: this.state.currentPlayer, row, col })

    this.emit(EVENT.UPDATE)

    this.nextTurn()
  }

  nextTurn() {
    this.updateStatus()

    if (this.state.status === STATUS.PLAYING) {
      this.nextPlayer()
      this.emit(EVENT.NEXT_TURN)
    } else {
      this.emit(EVENT.FINISH)
    }
  }

  nextPlayer() {
    if (this.state.currentPlayer + 1 >= this.options.players) {
      this.state.currentPlayer = 0
    } else {
      this.state.currentPlayer++
    }
  }

  updateStatus() {
    this.state.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === '') return

        const win = checker({
          board: this.state.board,
          cols: this.options.cols,
          rows: this.options.rows,
          sequenceToWin: this.options.sequenceToWin,
          row: rowIndex,
          col: colIndex,
        })

        if (win) {
          this.state.status = STATUS.FINISH
          this.state.winner = this.state.currentPlayer
          this.state.winnerPos = win
        }
      })
    })
  }
}

Tictactoe.prototype.STATUS = STATUS
Tictactoe.prototype.EVENT = EVENT

export default Tictactoe
