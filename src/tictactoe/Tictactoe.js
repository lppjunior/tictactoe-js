/*
 * Tictactoe-js - 2023-02-23
 * @see: http://en.wikipedia.org/wiki/Tictactoe
 *      http://pt.wikipedia.org/wiki/Jogo_da_velha
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

import * as UseCases from './use-cases'
import State from './State'
import { EVENT, STATUS } from './constants'

class Tictactoe {
  constructor (options = {}) {
    this.options = {
      rows: 3,
      cols: 3,
      players: 2,
      ...options
    }
    this.observer = new Observer()
  }

  start () {
    this.state = new State(this.options)

    this.emit(EVENT.START)

    return this
  }

  emit (event) {
    const state = this.getState()

    this.observer.emit(event, state)
    this.observer.emit(EVENT.ALL, { event, state })
  }

  addListener (event, fn) {
    this.observer.on(event, fn)

    return this
  }

  getState () {
    return this.state.get()
  }

  nextTurn () {
    this.updateStatus()

    if (this.state.get('status') === STATUS.PLAYING) {
      this.nextPlayer()
      this.emit(EVENT.NEXT_TURN)
    } else {
      this.emit(EVENT.FINISH)
    }
  }
}

Object.keys(UseCases).forEach((useCase) => {
  Tictactoe.prototype[useCase] = UseCases[useCase]
})

export default Tictactoe
