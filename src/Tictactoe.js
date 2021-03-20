/*
 * Tictactoe with jQuery - 2017-01-10
 *     @see: http://en.wikipedia.org/wiki/Tictactoe
 *			 http://pt.wikipedia.org/wiki/Jogo_da_velha
 *
 * Copyright (c) 2017 Luiz Paulo
 * Site: http://lppjunior.com
 *
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Tictactoe game
 *
 * @version 0.0.2
 * @author Luiz Paulo <lppjunior@gmail.com>
 **/

const Tictactoe = (function () {
  /**
	 * Public class, instantiable for game initiation
	 *
	 * @this {Tictactoe}
	 *
	 */
  class Tictactoe {
    /**
		 * Make a instance of controller and view classes
		 *
		 * @constructor
		 * @param {object} config JSON with custom configurations
		 *
		 **/
    constructor (config) {
      const conf = jQuery.extend(CONFIG_DEFAULT, config)

      this.controller = new TictactoeController(conf)
      this.view = new conf.view(this.controller)
    }

    /**
		 * Define all game configuration
		 *
		 * @param {object} config JSON with custom configurations
		 *
		 **/
    setConfig (config) {
      this.controller.setConfig(config)
    }

    /**
		 * Clean all properties of game and start a new
		 *
		 **/
    start () {
      if (this.controller.target.length === 0) {
        const error = new TictactoeError('Target object not found.')
        jQuery(this.controller.target).trigger('error', [error])
      }

      this.view.render()
      this.controller.start()
    }
  }

  // Define here all privated class and properties

  // {TictactoeView}

  // Define player Type
  Tictactoe.USER = 1
  Tictactoe.COMPUTER_EASY = 2
  Tictactoe.COMPUTER_MEDIUM = 3
  Tictactoe.COMPUTER_HARD = 4

  // Define turn Type
  Tictactoe.NONE = 0
  Tictactoe.CIRCLE = 1
  Tictactoe.CROSS = 2

  // Define all victoty positions
  const VICTORY = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  // Define default configurations
  const CONFIG_DEFAULT = {
    target: null,
    enemy: Tictactoe.COMPUTER_MEDIUM,
    start: Tictactoe.USER,
    view: TictactoeView
  }

  /**
	 * Privated class
	 * Control all game features
	 *
	 * @this {TictactoeController}
	 *
	 */
  class TictactoeController {
    /**
		 * @constructor
		 * @param {object} config JSON with custom configurations
		 *
		 **/
    constructor (conf) {
      this.enemy = conf.enemy
      this.target = jQuery(conf.target)

      this.on('restart', () => { this.start() })
        .on('play', (e, pos) => { this.play(pos) })
    }

    /**
		 * Sets some function for a game event
		 *
		 * @param {string} event Event name
		 * @param {function} returnFunction Function to execute event returns
		 *
		 **/
    on (event, returnFunction) {
      jQuery(this.target).on(event, returnFunction)
      return this
    }

    /**
		 * Clean all game properties
		 *
		 **/
    clean () {
      this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      this.finish = false
      this.turn = Tictactoe.CIRCLE
      this.victory = Tictactoe.NONE
      this.gamePos = 0
    }

    /**
		 * Start a new game
		 *
		 **/
    start () {
      this.clean()
      this.update()
    }

    /**
		 * Called on 'Tictactoe.USER' execute a event
		 *
		 * @param {int} pos Board position to play
		 *
		 **/
    play (pos) {
      this.playTurn(pos, Tictactoe.USER)
    }

    /**
		 * Play called on any User type execute a event
		 *
		 * @param {int} pos Board position to play
		 * @param {int} user User type
		 *
		 **/
    playTurn (pos, user) {
      if (this.board[pos] !== 0 || this.finish) {
        return
      }

      const turn = this.turn
      this.turn = (this.turn === Tictactoe.CIRCLE) ? Tictactoe.CROSS
        : Tictactoe.CIRCLE

      this.board[pos] = turn
      this.gamePos++

      this.update()
      this.checkFinish()

      if (user === Tictactoe.USER) {
        this.playBot()
      }
    }

    /**
		 * Executed after Tictactoe.USER played and config.enemy
		 *    configured to Tictactoe.COMPUTER_${LEVEL}
		 *
		 **/
    playBot () {
      if (this.finish) return

      let fn = null
      switch (this.enemy) {
        case Tictactoe.COMPUTER_EASY:
          fn = TictactoeBot.easy
          break

        case Tictactoe.COMPUTER_MEDIUM:
          fn = TictactoeBot.medium
          break

        case Tictactoe.COMPUTER_HARD:
          fn = TictactoeBot.hard
          break
      }

      if (fn != null) {
        fn(this.board, this.turn, (position) => {
          this.playTurn(position, this.enemy)
        }, this.gamePos)
      }
    }

    /**
		 * Execute 'update' trigger on board update
		 *
		 **/
    update () {
      jQuery(this.target).trigger('update', [this.board])
    }

    /**
		 * Check if game is Finished
		 * Case 'Tictactoe.CIRCLE' won
		 * Case 'Tictactoe.CROSS' won
		 * Case all game possibilities are over
		 *
		 * Execute 'finish' trigger on finished
		 *
		 **/
    checkFinish () {
      let victoryPosition

      // Verify if some player won the game
      for (const v in VICTORY) {
        if (this.board[VICTORY[v][0]] === this.board[VICTORY[v][1]] &&
					 this.board[VICTORY[v][0]] === this.board[VICTORY[v][2]] &&
					 this.board[VICTORY[v][0]] !== Tictactoe.NONE) {
          this.finish = true
          this.victory = this.board[VICTORY[v][0]]
          victoryPosition = VICTORY[v]
          break
        }
      }

      // Verify if game possibilities are over
      if (!this.finish && this.gamePos === 9) {
        this.finish = true
        this.victory = Tictactoe.NONE
        victoryPosition = []
      }

      // If game over, execute  finish trigger
      if (this.finish) {
        const params = [this.victory, victoryPosition]
        jQuery(this.target).trigger('finish', params)
      }
    }
  }

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
    static easy (board, turn, play) {
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

  /**
	 * All errors encountered during into this game
	 *
	 */
  class TictactoeError extends Error {
    /**
		 * @constructor
		 *
		 */
    constructor (message) {
      super(message)
    }
  }

  return Tictactoe
})()
