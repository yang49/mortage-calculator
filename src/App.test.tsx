import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders mortgage calculator heading and sections', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /mortgage calculator/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /mortgage inputs/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument();
});
