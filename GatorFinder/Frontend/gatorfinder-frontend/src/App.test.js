import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
jest.mock('axios');

test('renders GatorFinder logo', () => {
  window.history.pushState({}, 'Home Page', '/home');
  render(<App />);
  const logoElement = screen.getByText(/GatorFinder/i);
  expect(logoElement).toBeInTheDocument();
});


describe('login/signup tests', () => {
  test('non ufl email login attempt', () => {
    window.history.pushState({}, 'Login Page', '/login');
    render(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    const loginButton = screen.getByRole('button', { name: /Request OTP/i });
    fireEvent.click(loginButton);
    const errorMessage = screen.getByText(/Only ufl\.edu email addresses are allowed\./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('valid ufl email login attempt', async () => {
    axios.get.mockResolvedValue({ status: 200, data: {} });
    window.history.pushState({}, 'Login Page', '/login');
    render(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: '@ufl.edu' } });
    const loginButton = screen.getByRole('button', { name: /Request OTP/i });
    fireEvent.click(loginButton);
    const enterOTPText = await waitFor(() => screen.findByText(/Enter OTP/i));
    expect(enterOTPText).toBeInTheDocument();
  });

  test('navigates from Signup to Login page', () => {
    window.history.pushState({}, 'Sign Up Page', '/signup');
    render(<App />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /login/i }));
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});

test('navigates to profile', async () => {
  window.history.pushState({}, 'Home Page', '/home');
  render(<App />);
  const profileButton = screen.getByLabelText(/Profile/i);
  fireEvent.click(profileButton);
  const yourProfileText = await screen.findByText(/Your Profile/i);
  expect(yourProfileText).toBeInTheDocument();
});