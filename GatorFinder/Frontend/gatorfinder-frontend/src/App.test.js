import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders GatorFinder logo', () => {
  window.history.pushState({}, 'Home Page', '/home');
  render(<App />);
  const logoElement = screen.getByText(/GatorFinder/i);
  expect(logoElement).toBeInTheDocument();
});

test('search bar functionality test', () => {
  render(<App />);
  const searchBar = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchBar, { target: { value: 'event 1' } });
  const event1 = screen.getByText('Event 1', { selector: 'h3' });
  expect(event1).toBeInTheDocument();
  const otherEvents = screen.queryByText(/event 2/i);
  expect(otherEvents).not.toBeInTheDocument();
});

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