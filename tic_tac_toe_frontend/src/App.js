import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App is the main component for the Tic Tac Toe game UI.
 * It renders the game board, shows current player, game status (win/draw/ongoing),
 * and provides a button to restart the game.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Game state: 9 cells for the board, 'X' starts, and status flags
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived values
  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => !winner && squares.every(Boolean), [winner, squares]);

  useEffect(() => {
    if (winner || isDraw) {
      setIsGameOver(true);
    } else {
      setIsGameOver(false);
    }
  }, [winner, isDraw]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    if (squares[index] || isGameOver) return; // ignore if occupied or game over
    setSquares(prev => {
      const next = prev.slice();
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext(prev => !prev);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
  };

  const currentPlayer = xIsNext ? 'X' : 'O';

  let statusMessage = '';
  if (winner) {
    statusMessage = `Winner: ${winner.player}`;
  } else if (isDraw) {
    statusMessage = "It's a draw!";
  } else {
    statusMessage = `Next player: ${currentPlayer}`;
  }

  return (
    <div className="App">
      <header className="app-header-ttt">
        <div className="header-bar">
          <h1 className="title">Tic Tac Toe</h1>
          <div className="header-actions">
            <button
              className="btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button
              className="btn btn-accent"
              onClick={restartGame}
              aria-label="Restart game"
            >
              ↻ Restart
            </button>
          </div>
        </div>

        <div className="game-container" role="application" aria-label="Tic Tac Toe game">
          <div className="status-bar" aria-live="polite">
            <span className={`badge ${winner ? 'winner' : isDraw ? 'draw' : 'turn'}`}>
              {statusMessage}
            </span>
            {!winner && !isDraw && (
              <span className="player-indicator">
                Player X = ✖ | Player O = ◯
              </span>
            )}
          </div>

          <Board
            squares={squares}
            onCellClick={handleCellClick}
            winningLine={winner?.line || []}
            isDisabled={Boolean(winner) || isDraw}
          />

          <footer className="footer-note">
            Two players take turns. First to line up three wins.
          </footer>
        </div>
      </header>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders a 3x3 grid of cells for the Tic Tac Toe game.
 * Props:
 * - squares: array of 9 elements ('X' | 'O' | null)
 * - onCellClick(index): handler for when a cell is clicked
 * - winningLine: array of indices that form the winning combination
 * - isDisabled: boolean to disable interaction when game is over
 */
function Board({ squares, onCellClick, winningLine, isDisabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => {
        const isWinning = winningLine.includes(idx);
        const label = `Cell ${idx + 1}, ${value ? (value === 'X' ? 'X' : 'O') : 'empty'}`;
        return (
          <Cell
            key={idx}
            value={value}
            onClick={() => onCellClick(idx)}
            isWinning={isWinning}
            isDisabled={isDisabled || Boolean(value)}
            ariaLabel={label}
          />
        );
      })}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Cell renders a single square on the board.
 * Props:
 * - value: 'X' | 'O' | null
 * - onClick: click handler
 * - isWinning: highlight if part of winning line
 * - isDisabled: disable interaction if true
 * - ariaLabel: accessible label for screen readers
 */
function Cell({ value, onClick, isWinning, isDisabled, ariaLabel }) {
  const symbol = value === 'X' ? '✖' : value === 'O' ? '◯' : '';
  return (
    <button
      className={`cell ${isWinning ? 'cell-winning' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
      role="gridcell"
      aria-label={ariaLabel}
    >
      {symbol}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner determines if there's a winning line on the board.
 * Returns:
 * - null if no winner yet
 * - { player: 'X' | 'O', line: number[] } if a winner exists
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
