import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../src/Login.jsx';

test('renderiza Login correctamente', () => {
  render(<Login />);
  // Busca el encabezado
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  // Busca el botón
  expect(screen.getByText(/entrar/i)).toBeInTheDocument();
});
