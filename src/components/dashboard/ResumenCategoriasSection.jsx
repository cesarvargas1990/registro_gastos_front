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
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <h2 className="mb-4 flex items-center gap-3 text-base font-black text-[#071843]">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <FaTable />
        </span>
        Resumen mensual por categoría
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs text-[#172756]">
          <thead className="bg-indigo-50/70 text-[11px] font-black text-[#27356d]">
            <tr>
              {columnas.map((col) => (
                <th key={col} className="border border-indigo-100 px-3 py-2 capitalize">
                  {col.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, i) => {
              const rowClass =
                fila.Mes === mesActual
                  ? 'bg-gray-700/60 bg-indigo-50/80'
                  : 'odd:bg-white even:bg-slate-50/65';
              return (
                <tr key={i} className={rowClass}>
                  {columnas.map((col) => (
                    <td key={col} className="whitespace-nowrap border border-indigo-50 px-3 py-2">
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
          <tfoot className="bg-indigo-50/80 font-black text-[#172756]">
            <tr>
              {columnas.map((col, index) => {
                const esNumerico = datos.every((fila) => !isNaN(Number(fila[col])));
                const total = esNumerico
                  ? datos.reduce((acc, fila) => acc + Number(fila[col] || 0), 0)
                  : '';

                return (
                  <td key={col} className="whitespace-nowrap border border-indigo-100 px-3 py-2">
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
