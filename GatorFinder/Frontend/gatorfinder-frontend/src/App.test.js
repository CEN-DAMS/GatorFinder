import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders GatorFinder logo', () => {
  render(<App />);
  const logoElement = screen.getByText(/gatorfinder/i);
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