import React from 'react';
import { FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function TotalesCategoriaSection({ totalesCategoria }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <h2 className="mb-4 flex items-center gap-3 text-base font-black text-[#071843]">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
          <FaTable />
        </span>
        Totales por Categoria
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[#172756]">
          <thead className="bg-indigo-50/70 text-xs font-black text-[#27356d]">
            <tr>
              <th className="border border-indigo-100 px-3 py-2">Categoría</th>
              <th className="border border-indigo-100 px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {totalesCategoria.map((item) => (
              <tr key={item.categoria_id} className="odd:bg-white even:bg-slate-50/65">
                <td className="border border-indigo-50 px-3 py-2 font-semibold">
                  {item.categoria}
                </td>
                <td className="border border-indigo-50 px-3 py-2 font-bold">
                  {formatCurrency(item.total_categoria)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
