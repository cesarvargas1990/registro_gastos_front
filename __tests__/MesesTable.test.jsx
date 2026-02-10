import { render, screen } from '@testing-library/react';
import MesesTable from '../MesesTable.jsx';

test('renderiza MesesTable correctamente', () => {
  render(<MesesTable />);
  expect(screen.getByText(/meses/i)).toBeInTheDocument();
});
