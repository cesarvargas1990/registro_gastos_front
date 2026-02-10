import React from 'react';
import { FaTable } from 'react-icons/fa';

export default function ResumenCategoriasSection({ columnas, datos }) {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const mesActual = meses[new Date().getMonth()];
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaTable className="text-teal-400" /> Resumen mensual por categoría
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded shadow p-4">
        <table className="min-w-full text-sm text-left border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr>
              {columnas.map((col) => (
                <th key={col} className="px-4 py-2 border border-gray-600 capitalize">
                  {col.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, i) => {
              const rowClass = fila.Mes === mesActual ? 'bg-gray-700/60' : '';
              return (
                <tr key={i} className={rowClass}>
                  {columnas.map((col) => (
                    <td key={col} className="px-4 py-2 border border-gray-700">
                      {!isNaN(Number(fila[col]))
                        ? `$ ${Number(fila[col]).toLocaleString('es-CO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : fila[col]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-900 text-white font-semibold">
            <tr>
              {columnas.map((col, index) => {
                const esNumerico = datos.every((fila) => !isNaN(Number(fila[col])));
                const total = esNumerico
                  ? datos.reduce((acc, fila) => acc + Number(fila[col] || 0), 0)
                  : '';

                return (
                  <td key={col} className="px-4 py-2 border border-gray-700">
                    {index === 0
                      ? 'Total'
                      : esNumerico
                        ? `$ ${total.toLocaleString('es-CO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : ''}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
