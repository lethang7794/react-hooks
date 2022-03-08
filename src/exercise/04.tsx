// Real World Review: Tic Tac Toe
// http://localhost:3000/isolated/exercise/04.tsx

import * as React from 'react'
import {
  calculateStatus,
  calculateNextValue,
  calculateWinner,
} from '../tic-tac-toe-utils'
import type {Squares} from '../tic-tac-toe-utils'

const SQUARES_KEY = 'squares'

function Board() {
  const [squares, setSquares] = React.useState<Squares>(() => {
    let localStorageValue = window.localStorage.getItem(SQUARES_KEY)
    if (localStorageValue) {
      try {
        let value = JSON.parse(localStorageValue)
        return value
      } catch (error) {
        console.log('Something went wrong')
      }
      return Array(9).fill(null)
    }
    return Array(9).fill(null)
  })

  React.useEffect(() => {
    localStorage.setItem(SQUARES_KEY, JSON.stringify(squares))
  }, [squares])

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(index: number) {
    if (winner || squares[index]) return

    setSquares(previousSquares => {
      const nextSquares = [...previousSquares]
      nextSquares[index] = nextValue
      return nextSquares
    })
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i: number) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function App() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

export {App}

/*
eslint
  @typescript-eslint/no-unused-vars: "off",
*/
