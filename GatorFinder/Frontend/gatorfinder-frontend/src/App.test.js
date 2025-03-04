import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('search bar functionality test', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const searchBar = screen.getByPlaceholderText(/search events/i); 
  fireEvent.change(searchBar, { target: { value: 'event 1' } });
  const event1 = screen.getByText(/event 1/i);
  expect(event1).toBeInTheDocument();
  const otherEvents = screen.queryByText(/event 2/i);
  expect(otherEvents).not.toBeInTheDocument();
});