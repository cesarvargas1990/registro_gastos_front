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
      className={`h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 ${className}`}
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
