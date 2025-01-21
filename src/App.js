import React, { useState } from 'react';

function Square({value, onSquareClick, color=null}) {
  return (
    <button className="square" onClick={onSquareClick} style={{
      backgroundColor: color,
      fontSize: '48px',
    }}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  const winner = calculateWinner(squares) ? squares[calculateWinner(squares)[0]] : null;
  const winLine = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i) {
    if(!!squares[i] || calculateWinner(squares)) return;

    const newSquares = squares.slice();
    if (xIsNext) {
      newSquares[i] = 'X';
    } else {
      newSquares[i] = 'O';
    }
    onPlay(newSquares);
  }

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
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (!!squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }

    return null;
  }

  return (
    <>
      <div className="status" style={{
        marginBottom: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        {status}
      </div>
      {Array.from({length: 3}, (_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array.from({length: 3}, (_, colIndex) => (
            winLine && winLine.includes(rowIndex * 3 + colIndex) ? (
              <Square
                key={rowIndex * 3 + colIndex}
                value={squares[rowIndex * 3 + colIndex]}
                onSquareClick={() => handleClick(rowIndex * 3 + colIndex)}
                color='yellow'
              />
            ) : (
              <Square
                key={rowIndex * 3 + colIndex}
                value={squares[rowIndex * 3 + colIndex]}
                onSquareClick={() => handleClick(rowIndex * 3 + colIndex)}
              />
            )
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currMove, setCurrMove] = useState(0);
  const currentSquares = history[currMove];
  const xIsNext = (currMove % 2) === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move No. ' + move;
    } else {
      description = 'Go to game start';
    }
    if (move === currMove) {
      return (
        <li key={move}>
          <p style={{
            fontWeight: 'bold',
            marginBottom: '5px',
            fontSize: '14px',
          }}>Move No. {move}</p>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button style={{
            marginBottom: '5px',
          }}
          onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <>
      <div style={{
        backgroundColor: 'black',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        <h1 style={{
          color: 'white',
          margin: '0',
          fontSize: '64px',
        }}>
          Tic Tac Toe
        </h1>
      </div>
      <div className="game">
        <div className="game-board" style={{marginBottom: '10px'}}>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div>
          <div className='game-info'></div>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
