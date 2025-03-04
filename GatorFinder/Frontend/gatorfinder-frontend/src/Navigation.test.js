import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('Navigation between Login and Signup pages', () => {
  test('navigates from Login to Signup page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/sign up/i));
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('navigates from Signup to Login page', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
