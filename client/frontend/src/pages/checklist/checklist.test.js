import { render, screen } from '@testing-library/react';
import Checklist from './checklist';

test('renders learn react link', () => {
  render(<Checklist />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
