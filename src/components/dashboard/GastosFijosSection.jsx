import React from 'react';
import { FaEllipsisH, FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function GastosFijosSection({
  resumenTabla,
  resumenMensual,
  meses,
  onToggleGastoFijo,
}) {
  const mesActual = meses[new Date().getMonth()];
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-base font-black text-[#071843]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
            <FaTable />
          </span>
          Resumen de Gastos Fijos
        </h2>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-indigo-500"
        >
          <FaEllipsisH />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs text-[#172756]">
          <thead className="bg-indigo-50/70 text-[11px] font-black text-[#27356d]">
            <tr>
              <th className="border border-indigo-100 px-3 py-2">Descripción</th>
              <th className="border border-indigo-100 px-3 py-2">Valor</th>
              {meses.map((mes) => (
                <th
                  key={mes}
                  className={`border border-indigo-100 px-3 py-2 text-center ${
                    mes === mesActual ? 'bg-indigo-100/80' : ''
                  }`}
                >
                  {mes.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resumenTabla.map((item, i) => (
              <tr key={i} className="odd:bg-white even:bg-slate-50/65">
                <td className="whitespace-nowrap border border-indigo-50 px-3 py-2 font-semibold">
                  {item.Descripción}
                </td>
                <td className="whitespace-nowrap border border-indigo-50 px-3 py-2 font-bold">
                  {formatCurrency(item.Valor)}
                </td>
                {meses.map((mes) => (
                  <td
                    key={mes}
                    className={`border border-indigo-50 px-3 py-2 text-center ${
                      mes === mesActual ? 'bg-indigo-50/80' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!item[mes]}
                      onChange={() => onToggleGastoFijo(item, mes)}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-400"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-50/80 text-xs font-black text-[#172756]">
              <td className="border border-indigo-100 px-3 py-2">Total por mes</td>
              <td className="border border-indigo-100 px-3 py-2" />
              {meses.map((mes) => {
                const total = resumenMensual.find((r) => r.Mes === mes);
                const val = Number(total?.Total_Mensual || 0);
                return (
                  <td
                    key={mes}
                    className={`whitespace-nowrap border border-indigo-100 px-3 py-2 text-right ${
                      mes === mesActual ? 'bg-indigo-100/80' : ''
                    }`}
                  >
                    {formatCurrency(val)}
                  </td>
                );
              })}
            </tr>
            <tr className="bg-white text-xs font-black text-[#172756]">
              <td className="border border-indigo-100 px-3 py-2">Pendiente</td>
              <td className="border border-indigo-100 px-3 py-2" />
              {meses.map((mes) => {
                const resumen = resumenMensual.find((r) => r.Mes === mes);
                const val = Number(resumen?.Pendiente_gastoFijo || 0);
                return (
                  <td
                    key={mes}
                    className={`whitespace-nowrap border border-indigo-100 px-3 py-2 text-right ${
                      mes === mesActual ? 'bg-indigo-100/80' : ''
                    }`}
                  >
                    {formatCurrency(val)}
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
