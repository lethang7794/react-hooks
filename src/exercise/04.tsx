// Real World Review: Tic Tac Toe
// http://localhost:3000/isolated/exercise/04.tsx

import * as React from 'react'
import {
  calculateStatus,
  calculateNextValue,
  calculateWinner,
} from '../tic-tac-toe-utils'
import type {Squares} from '../tic-tac-toe-utils'
import {useLocalStorageState} from '../utils'

const SQUARES_KEY = 'squares'
const CURRENT_STEP_KEY = 'currentStep'

function Board() {
  const [history, setHistory] = useLocalStorageState<Squares[]>(SQUARES_KEY, [
    Array(9).fill(null),
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    CURRENT_STEP_KEY,
    0,
  )

  const squares = history[currentStep]
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(index: number) {
    if (winner || squares[index]) return

    setHistory(prevHistory => {
      const prevSquares = prevHistory[currentStep]
      const nextSquares = [...prevSquares]
      nextSquares[index] = nextValue

      if (currentStep < prevHistory.length) {
        prevHistory = prevHistory.slice(0, currentStep + 1)
      }
      const nextHistory = [...prevHistory, nextSquares]
      return nextHistory
    })
    setCurrentStep(prev => prev + 1)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
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
      <ul>
        {history.map((h, i) => (
          <li>
            <button
              onClick={() => setCurrentStep(i)}
              disabled={i === currentStep}
            >
              {`Go to step ${i}`} - {i === currentStep ? 'Current' : ''}
            </button>
          </li>
        ))}
      </ul>
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
