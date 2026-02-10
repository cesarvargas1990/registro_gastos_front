import React, { useEffect, useState } from 'react';
import { getJson } from './utils/api';

function FiltroCategorias({ value, onChange, className = '' }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getJson('/categorias')
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Error cargando categorías:', error));
  }, []);

  return (
    <select
      value={value}
      className={`px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ${className}`}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecciona una categoría</option>
      {categorias.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.nombre}
        </option>
      ))}
    </select>
  );
}

export default FiltroCategorias;
