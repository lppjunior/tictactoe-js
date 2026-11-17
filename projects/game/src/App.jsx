import React, { useEffect, useRef, useState } from 'react'

import chooseMove from '@tictactoe/bot'
import Tictactoe, { PLAYER, STATUS } from '@tictactoe/main'
import {
  LANGUAGES,
  LANGUAGE_NAMES,
  HTML_LANG,
  LANGUAGE_PATHS,
  RTL_LANGUAGES,
  MESSAGES,
  languageFromPath,
  storeLanguage
} from './i18n.mjs'

const DIFFICULTIES = ['easy', 'medium', 'hard']

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

function getStatusLabel (state, t) {
  if (state.status === STATUS.PLAYING) {
    return t.turn(state.currentPlayer === 0 ? PLAYER.X : PLAYER.O)
  }
  return state.winner ? t.won(state.winner) : t.draw
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

function LanguageSwitcher ({ lang, onChange, t }) {
  return (
    <select
      aria-label={t.language}
      className='language-switcher'
      onChange={event => onChange(event.target.value)}
      value={lang}
    >
      {LANGUAGES.map(code => (
        <option key={code} lang={code} value={code}>
          {LANGUAGE_NAMES[code]}
        </option>
      ))}
    </select>
  )
}

function GameCard ({ game, onMove, onClose, t }) {
  const { id, mode, state } = game
  const scores = getScores(state)
  const finished = state.status === STATUS.FINISHED

  return (
    <article className='game-card' aria-labelledby={`game-title-${id}`}>
      <header className='game-card-header'>
        <div>
          <h2 id={`game-title-${id}`} className='game-card-title'>
            {t.gameTitle(id)}
          </h2>
          <p className='game-mode-label'>
            {mode === 'computer' ? t.modeComputer : t.modePlayers}
          </p>
        </div>
        <button
          aria-label={t.closeGame(id)}
          className='icon-button close-game'
          onClick={() => onClose(id)}
          type='button'
        >
          <span aria-hidden='true'>×</span>
        </button>
      </header>

      <div className='game-card-content'>
        <p className='game-status'>
          {getStatusLabel(state, t)}
        </p>
        <p
          className='game-score'
          aria-label={t.scoreLabel(scores.x, scores.draws, scores.o)}
        >
          <span className='score-x'>X {scores.x}</span>
          <span aria-hidden='true'>·</span>
          <span>{t.drawsShort} {scores.draws}</span>
          <span aria-hidden='true'>·</span>
          <span className='score-o'>O {scores.o}</span>
        </p>

        <div
          aria-label={t.boardLabel(id)}
          className='board'
          role='group'
        >
          {state.board.flatMap((row, rowIndex) => row.map((cell, colIndex) => {
            const position = rowIndex * state.cols + colIndex
            const isWinningCell = state.winningLine.includes(position)

            return (
              <button
                key={position}
                aria-label={t.cell(id, rowIndex + 1, colIndex + 1, cell)}
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

function App ({ lang, onLanguageChange, t }) {
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
      { id, mode, difficulty, state: copyState(game.getState()) },
      ...currentGames
    ])
    setAnnouncement(t.opened(id, PLAYER.X))
  }

  function closeGame (id) {
    gameInstances.current.delete(id)
    setGames((currentGames) => currentGames.filter((game) => game.id !== id))
    setAnnouncement(t.closed(id))
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
    setAnnouncement(t.moveAnnouncement(id, getStatusLabel(nextState, t)))
  }

  const isPlaying = games.length > 0

  return (
    <div className={`app ${isPlaying ? 'app--playing' : 'app--idle'}`}>
      <main className='game-layout'>
        <aside aria-label={t.setupLabel} className='setup-card'>
          <header className='brand'>
            <BrandMark />
            <div>
              <h1 className='brand-title'>
                <span>{t.titleTop}</span>
                <span className='brand-title-accent'>{t.titleBottom}</span>
              </h1>
            </div>
            <LanguageSwitcher lang={lang} onChange={onLanguageChange} t={t} />
          </header>

          <div className='game-settings'>
            <fieldset className='setting-group'>
              <legend>{t.modeLegend}</legend>
              <div className='mode-options'>
                <button
                  aria-pressed={mode === 'players'}
                  className={`option-button ${mode === 'players' ? 'is-selected' : ''}`}
                  onClick={() => setMode('players')}
                  type='button'
                >
                  <span aria-hidden='true' className='option-icon'>2P</span>
                  {t.modePlayers}
                </button>
                <button
                  aria-pressed={mode === 'computer'}
                  className={`option-button ${mode === 'computer' ? 'is-selected' : ''}`}
                  onClick={() => setMode('computer')}
                  type='button'
                >
                  <span aria-hidden='true' className='option-icon'>AI</span>
                  {t.vsRobot}
                </button>
              </div>
            </fieldset>

            <fieldset className='setting-group' disabled={mode !== 'computer'}>
              <legend>{t.difficultyLegend}</legend>
              <div className='difficulty-options'>
                {DIFFICULTIES.map((value) => (
                  <button
                    key={value}
                    aria-pressed={difficulty === value}
                    className={`difficulty-button ${difficulty === value ? 'is-selected' : ''}`}
                    onClick={() => setDifficulty(value)}
                    type='button'
                  >
                    {t.difficulties[value]}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <button className='open-game-button' onClick={openGame} type='button'>
            <span aria-hidden='true'>▶</span>
            {t.play}
          </button>
          <p className='setup-hint'>
            {t.hint}
          </p>
        </aside>
        {isPlaying && (
          <section aria-label={t.openGames} className='games-column'>
            <h2 className='visually-hidden'>{t.openGames}</h2>
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClose={closeGame}
                onMove={playMove}
                t={t}
              />
            ))}
          </section>
        )}
      </main>

      <p aria-live='polite' className='visually-hidden' role='status'>
        {announcement}
      </p>
      <footer className='app-footer'><a href='https://lppjunior.com/'>lppjunior.com</a> · {t.gameName}</footer>
    </div>
  )
}

export default function AppWithLanguage () {
  const [lang, setLang] = useState(() => languageFromPath(window.location.pathname))
  const t = MESSAGES[lang]

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
    document.title = t.title
  }, [lang, t])

  useEffect(() => {
    const syncLanguage = () => setLang(languageFromPath(window.location.pathname))
    window.addEventListener('popstate', syncLanguage)

    return () => window.removeEventListener('popstate', syncLanguage)
  }, [])

  function changeLanguage (next) {
    if (next === lang) return
    storeLanguage(window.localStorage, next)
    window.history.pushState(null, '', LANGUAGE_PATHS[next])
    setLang(next)
  }

  return <App lang={lang} onLanguageChange={changeLanguage} t={t} />
}
