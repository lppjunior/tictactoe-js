/** @jest-environment jsdom */

import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'

import App from './App'

describe('game screen', () => {
  test('starts with the new game panel and no global statistics', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Jogo da Velha' })).toBeTruthy()
    expect(screen.getByText('lppjunior.com · Jogo da Velha')).toBeTruthy()
    expect(screen.queryByText(/três em linha/i)).toBeNull()
    expect(screen.getAllByRole('button', { name: 'JOGAR' })).toHaveLength(1)
    const setupPanel = screen.getByRole('complementary', {
      name: 'Configuração de nova partida'
    })
    expect([...setupPanel.querySelectorAll('fieldset legend')].map((legend) => (
      legend.textContent
    ))).toEqual(['Modo de jogo', 'Dificuldade do robô'])
    const setupButtons = within(setupPanel).getAllByRole('button')
    expect(setupButtons[setupButtons.length - 1]).toBe(
      screen.getByRole('button', { name: 'JOGAR' })
    )
    expect(screen.queryByRole('region', { name: 'Partidas abertas' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Abrir partida' })).toBeNull()
    expect(screen.queryByText(/estatísticas/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /nova rodada/i })).toBeNull()
  })

  test('opens independent games and keeps each board state separate', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'JOGAR' }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Partida 1, linha 1, coluna 1: vazia'
    }))
    fireEvent.click(screen.getByRole('button', { name: 'JOGAR' }))

    const firstBoard = within(screen.getByRole('group', {
      name: 'Tabuleiro da partida 1'
    }))
    const secondBoard = within(screen.getByRole('group', {
      name: 'Tabuleiro da partida 2'
    }))

    expect(firstBoard.getByRole('button', {
      name: 'Partida 1, linha 1, coluna 1: X'
    })).toBeTruthy()
    expect(secondBoard.getByRole('button', {
      name: 'Partida 2, linha 1, coluna 1: vazia'
    })).toBeTruthy()
    const main = screen.getByRole('main')
    const articles = within(main).getAllByRole('article')
    expect(articles.map((article) => article.getAttribute('aria-labelledby'))).toEqual([
      'game-title-2',
      'game-title-1'
    ])
    expect(screen.getByRole('complementary', { name: 'Configuração de nova partida' }).compareDocumentPosition(
      screen.getByRole('region', { name: 'Partidas abertas' })
    ) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('button', { name: /nova rodada/i })).toBeNull()
  })

  test('plays the robot response on the same board', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Contra robô' }))
    fireEvent.click(screen.getByRole('button', { name: 'JOGAR' }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Partida 1, linha 1, coluna 1: vazia'
    }))

    const board = screen.getByRole('group', { name: 'Tabuleiro da partida 1' })
    const marks = [...board.querySelectorAll('.board-cell')]
      .filter((cell) => cell.textContent.trim() !== '')

    expect(marks).toHaveLength(2)
    expect(within(board).getByRole('button', {
      name: 'Partida 1, linha 1, coluna 1: X'
    })).toBeTruthy()
    expect(screen.getByText('Vez de X')).toBeTruthy()
  })

  test('places new games before the remaining games when a game is closed', () => {
    render(<App />)
    const play = screen.getByRole('button', { name: 'JOGAR' })

    fireEvent.click(play)
    fireEvent.click(play)
    fireEvent.click(screen.getByRole('button', { name: 'Fechar partida 1' }))
    fireEvent.click(play)

    expect(screen.getAllByRole('article').map((article) => article.getAttribute('aria-labelledby'))).toEqual([
      'game-title-3',
      'game-title-2'
    ])
  })
})
