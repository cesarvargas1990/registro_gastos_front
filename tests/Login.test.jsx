import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/Login.jsx';

jest.mock('../src/utils/api', () => ({
  loginUser: jest.fn(),
}));

const { loginUser } = require('../src/utils/api');

test('renderiza Login correctamente', () => {
  render(<Login onLogin={() => {}} />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  expect(screen.getByText(/entrar/i)).toBeInTheDocument();
});

test('login exitoso llama onLogin', async () => {
  loginUser.mockResolvedValueOnce('jwt-token');
  const onLogin = jest.fn();
  render(<Login onLogin={onLogin} />);
  fireEvent.change(screen.getByPlaceholderText(/correo/i), {
    target: { value: 'admin@mail.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: '123456' },
  });
  fireEvent.click(screen.getByText(/entrar/i));
  await waitFor(() => expect(loginUser).toHaveBeenCalledWith('admin@mail.com', '123456'));
  expect(onLogin).toHaveBeenCalled();
});

test('login fallido muestra alerta', async () => {
  loginUser.mockRejectedValueOnce(new Error('Credenciales inválidas'));
  globalThis.alert = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<Login onLogin={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/correo/i), {
    target: { value: 'user@mail.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: 'wrongpass' },
  });
  fireEvent.click(screen.getByText(/entrar/i));
  await waitFor(() => expect(globalThis.alert).toHaveBeenCalledWith('Credenciales inválidas'));
  console.error.mockRestore();
});
