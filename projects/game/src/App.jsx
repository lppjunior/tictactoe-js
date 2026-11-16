import React, { useEffect, useRef, useState } from 'react'

import chooseMove from '@tictactoe/bot'
import Tictactoe, { PLAYER, STATUS } from '@tictactoe/main'

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' }
]

function copyState (state) {
  return {
    ...state,
    board: state.board.map((row) => [...row]),
    winningLine: [...state.winningLine]
  }
}

function getScores (state) {
  return {
    x: state.winner === PLAYER.X ? 1 : 0,
    draws: state.status === STATUS.FINISHED && state.winner === null ? 1 : 0,
    o: state.winner === PLAYER.O ? 1 : 0
  }
}

function getStatusLabel (state) {
  if (state.status === STATUS.PLAYING) {
    return `Vez de ${state.currentPlayer === 0 ? PLAYER.X : PLAYER.O}`
  }
  return state.winner ? `${state.winner} venceu!` : 'Deu velha!'
}

function BrandMark () {
  return (
    <svg
      aria-hidden='true'
      className='brand-mark'
      focusable='false'
      viewBox='0 0 64 64'
    >
      <path className='brand-mark-grid' d='M22 6v52M42 6v52M6 22h52M6 42h52' />
      <path className='brand-mark-x' d='m9 9 12 12m0-12L9 21m34 34 12-12m0 12L43 43' />
      <circle className='brand-mark-o' cx='52' cy='12' r='6' />
      <circle className='brand-mark-o' cx='12' cy='52' r='6' />
    </svg>
  )
}

function GameCard ({ game, onMove, onClose }) {
  const { id, mode, state } = game
  const scores = getScores(state)
  const finished = state.status === STATUS.FINISHED

  return (
    <article className='game-card' aria-labelledby={`game-title-${id}`}>
      <header className='game-card-header'>
        <div>
          <h2 id={`game-title-${id}`} className='game-card-title'>
            Partida #{id}
          </h2>
          <p className='game-mode-label'>
            {mode === 'computer' ? '1 jogador + robô' : '2 jogadores'}
          </p>
        </div>
        <button
          aria-label={`Fechar partida ${id}`}
          className='icon-button close-game'
          onClick={() => onClose(id)}
          type='button'
        >
          <span aria-hidden='true'>×</span>
        </button>
      </header>

      <div className='game-card-content'>
        <p className='game-status'>
          {getStatusLabel(state)}
        </p>
        <p
          className='game-score'
          aria-label={`Placar: X ${scores.x}, velhas ${scores.draws}, O ${scores.o}`}
        >
          <span className='score-x'>X {scores.x}</span>
          <span aria-hidden='true'>·</span>
          <span>Velha {scores.draws}</span>
          <span aria-hidden='true'>·</span>
          <span className='score-o'>O {scores.o}</span>
        </p>

        <div
          aria-label={`Tabuleiro da partida ${id}`}
          className='board'
          role='group'
        >
          {state.board.flatMap((row, rowIndex) => row.map((cell, colIndex) => {
            const position = rowIndex * state.cols + colIndex
            const isWinningCell = state.winningLine.includes(position)

            return (
              <button
                key={position}
                aria-label={`Partida ${id}, linha ${rowIndex + 1}, coluna ${colIndex + 1}: ${cell || 'vazia'}`}
                className={[
                  'board-cell',
                  cell ? `board-cell--${cell.toLowerCase()}` : '',
                  isWinningCell ? 'board-cell--winner' : ''
                ].filter(Boolean).join(' ')}
                disabled={Boolean(cell) || finished}
                onClick={() => onMove(id, position)}
                type='button'
              >
                {cell && <span aria-hidden='true'>{cell}</span>}
              </button>
            )
          }))}
        </div>
      </div>
    </article>
  )
}

export default function App () {
  const [mode, setMode] = useState('players')
  const [difficulty, setDifficulty] = useState('medium')
  const [games, setGames] = useState([])
  const [announcement, setAnnouncement] = useState('')
  const gameInstances = useRef(new Map())
  const nextGameId = useRef(1)

  useEffect(() => () => gameInstances.current.clear(), [])

  function openGame () {
    const id = nextGameId.current++
    const game = new Tictactoe({ rows: 3, cols: 3, players: 2 }).start()

    gameInstances.current.set(id, game)
    setGames((currentGames) => [
      ...currentGames,
      { id, mode, difficulty, state: copyState(game.getState()) }
    ])
    setAnnouncement(`Partida ${id} aberta. Vez de ${PLAYER.X}.`)
  }

  function closeGame (id) {
    gameInstances.current.delete(id)
    setGames((currentGames) => currentGames.filter((game) => game.id !== id))
    setAnnouncement(`Partida ${id} fechada.`)
  }

  function playMove (id, position) {
    const game = gameInstances.current.get(id)
    const currentGame = games.find((item) => item.id === id)
    if (!game || !currentGame || !game.play(position)) return

    let state = game.getState()
    if (
      currentGame.mode === 'computer' &&
      state.status === STATUS.PLAYING &&
      state.currentPlayer === 1
    ) {
      const botMove = chooseMove(state.board.flat(), PLAYER.O, currentGame.difficulty)
      if (botMove >= 0) game.play(botMove)
      state = game.getState()
    }

    const nextState = copyState(state)
    setGames((currentGames) => currentGames.map((item) => (
      item.id === id ? { ...item, state: nextState } : item
    )))
    setAnnouncement(`Partida ${id}: ${getStatusLabel(nextState)}.`)
  }

  const isPlaying = games.length > 0

  return (
    <div className={`app ${isPlaying ? 'app--playing' : 'app--idle'}`}>
      <main className='game-layout'>
        {isPlaying && (
          <section aria-label='Partidas abertas' className='games-column'>
            <h2 className='visually-hidden'>Partidas abertas</h2>
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClose={closeGame}
                onMove={playMove}
              />
            ))}
          </section>
        )}

        <aside aria-label='Configuração de nova partida' className='setup-card'>
          <header className='brand'>
            <BrandMark />
            <div>
              <h1 className='brand-title'>
                <span>Jogo da</span>
                <span className='brand-title-accent'>Velha</span>
              </h1>
            </div>
          </header>

          <div className='game-settings'>
            <fieldset className='setting-group'>
              <legend>Modo de jogo</legend>
              <div className='mode-options'>
                <button
                  aria-pressed={mode === 'players'}
                  className={`option-button ${mode === 'players' ? 'is-selected' : ''}`}
                  onClick={() => setMode('players')}
                  type='button'
                >
                  <span aria-hidden='true' className='option-icon'>2P</span>
                  2 jogadores
                </button>
                <button
                  aria-pressed={mode === 'computer'}
                  className={`option-button ${mode === 'computer' ? 'is-selected' : ''}`}
                  onClick={() => setMode('computer')}
                  type='button'
                >
                  <span aria-hidden='true' className='option-icon'>AI</span>
                  Contra robô
                </button>
              </div>
            </fieldset>

            <fieldset className='setting-group' disabled={mode !== 'computer'}>
              <legend>Dificuldade do robô</legend>
              <div className='difficulty-options'>
                {DIFFICULTIES.map(({ value, label }) => (
                  <button
                    key={value}
                    aria-pressed={difficulty === value}
                    className={`difficulty-button ${difficulty === value ? 'is-selected' : ''}`}
                    onClick={() => setDifficulty(value)}
                    type='button'
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button className='open-game-button' onClick={openGame} type='button'>
            <span aria-hidden='true'>▶</span>
            JOGAR
          </button>
          <p className='setup-hint'>
            Abra quantas partidas quiser — cada uma tem seu próprio placar.
          </p>
        </aside>
      </main>

      <p aria-live='polite' className='visually-hidden' role='status'>
        {announcement}
      </p>
      <footer className='app-footer'>LPPJUNIOR <span aria-hidden='true'>·</span> JOGO DA VELHA</footer>
    </div>
  )
}
