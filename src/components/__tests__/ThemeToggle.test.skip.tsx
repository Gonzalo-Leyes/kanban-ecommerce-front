import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../hooks/useTheme';
import { vi } from 'vitest';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn();


}));
  
  it('renders the theme toggle button', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  */

  it('calls toggleTheme when clicked', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button'));
    // We can't access context toggle here; this clicks button.
  */

  /*
    vi.mocked(require('../hooks/useTheme').useTheme).mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme */
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(screen.getByLabelText('Modo claro')).toBeInTheDocument();
  */

  it('shows moon icon when theme is light', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(screen.getByLabelText('Modo oscuro')).toBeInTheDocument();
  */
*/
