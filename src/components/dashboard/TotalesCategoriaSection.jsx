import React from 'react';
import { FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function TotalesCategoriaSection({ totalesCategoria }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaTable className="text-teal-400" /> Totales por Categoria
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded shadow p-4">
        <table className="min-w-full bg-gray-800 text-white rounded shadow">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2">Categoría</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {totalesCategoria.map((item) => (
              <tr key={item.categoria_id} className="border-t border-gray-600">
                <td className="p-2">{item.categoria}</td>
                <td className="p-2">{formatCurrency(item.total_categoria)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
