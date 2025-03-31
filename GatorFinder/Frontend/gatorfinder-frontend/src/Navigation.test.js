import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Navigation between Login and Signup pages', () => {
  test('navigates from Login to Signup page', () => {
    window.history.pushState({}, 'Login Page', '/login');
    render(<App />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /sign up/i }));
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
  });

  test('navigates from Signup to Login page', () => {
    window.history.pushState({}, 'Sign Up Page', '/signup');
    render(<App />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /login/i }));
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});