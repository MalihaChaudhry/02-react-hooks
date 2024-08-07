// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import {useState} from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'game',
    Array(9).fill(null),
  )
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const [history, setHistory] = useState([])
  const [currentlySelected, setCurrentlySelected] = useState(-1)

  function currentStep(i) {
    setCurrentlySelected(i + 1)
    if (i < 0) return setSquares(Array(9).fill(null))
    return setSquares(history[i])
  }

  function selectSquare(square) {
    if (winner || squares[square]) return
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    if (currentlySelected < history.length - 1) {
      const truncatedHistory = history.splice(
        0,
        history.length - currentlySelected,
      )
      setHistory(truncatedHistory)
    }
    setSquares(squaresCopy)
    const historyCopy = [...history]
    historyCopy.push(squaresCopy)
    setHistory(historyCopy)
    setCurrentlySelected(historyCopy.length)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setHistory([])
    setCurrentlySelected(-1)
  }

  function moves() {
    const startButton = (
      <li key="0">
        <button
          disabled={currentlySelected === -1}
          onClick={() => {
            currentStep(-1)
          }}
        >
          Go to game start {currentlySelected === -1 ? `(current)` : ''}
        </button>
      </li>
    )
    const buttons = history.map((arr, i) => {
      console.log({currentlySelected})
      const isCurrentlySelected = currentlySelected === i + 1
      let isLastButton = i === history.length - 1 && currentlySelected === -1
      const isDisabled = isCurrentlySelected || isLastButton

      console.log({
        i,
        history: history.length - 1,
        currentlySelected,
        isLastButton,
        isDisabled,
      })

      return (
        <li key={`${arr.toString()}-${i + 1}`}>
          <button disabled={isDisabled} onClick={() => currentStep(i)}>
            Go to move #{i + 1} {isDisabled ? '(current)' : ''}
          </button>
        </li>
      )
    })
    return [startButton, ...buttons]
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves()}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
