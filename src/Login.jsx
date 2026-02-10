import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === 'admin@mail.com' && password === '123456') {
      localStorage.setItem('authToken', 'fake-token'); // para persistencia
      onLogin();
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
