import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe and allows play and restart', () => {
  render(<App />);

  // Status shows next player
  expect(screen.getByText(/Next player: X/i)).toBeInTheDocument();

  // Click first cell, should place X
  const firstCell = screen.getByRole('gridcell', { name: /Cell 1/i });
  fireEvent.click(firstCell);
  expect(firstCell).toHaveTextContent('✖');

  // Status switches to O
  expect(screen.getByText(/Next player: O/i)).toBeInTheDocument();

  // Restart and ensure board resets
  fireEvent.click(screen.getByRole('button', { name: /Restart game/i }));
  expect(screen.getByText(/Next player: X/i)).toBeInTheDocument();
  expect(firstCell).toHaveTextContent('');
});
