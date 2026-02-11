import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/Login.jsx';

test('renderiza Login correctamente', () => {
  render(<Login onLogin={() => {}} />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  expect(screen.getByText(/entrar/i)).toBeInTheDocument();
});

test('login exitoso llama onLogin', () => {
  const onLogin = jest.fn();
  render(<Login onLogin={onLogin} />);
  fireEvent.change(screen.getByPlaceholderText(/correo/i), {
    target: { value: 'admin@mail.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: '123456' },
  });
  fireEvent.click(screen.getByText(/entrar/i));
  expect(onLogin).toHaveBeenCalled();
});

test('login fallido muestra alerta', () => {
  globalThis.alert = jest.fn();
  render(<Login onLogin={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText(/correo/i), {
    target: { value: 'user@mail.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: 'wrongpass' },
  });
  fireEvent.click(screen.getByText(/entrar/i));
  expect(globalThis.alert).toHaveBeenCalledWith('Credenciales inválidas');
});
