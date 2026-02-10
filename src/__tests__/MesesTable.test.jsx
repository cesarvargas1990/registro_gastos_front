import React from 'react';
import { render, screen } from '@testing-library/react';
import MesesTable from '../MesesTable.jsx';
jest.mock('axios');

test('renderiza MesesTable correctamente', () => {
  render(<MesesTable />);
  expect(screen.getByText(/meses/i)).toBeInTheDocument();
});
