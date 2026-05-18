import React from 'react';
import { FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function GastosFijosSection({
  resumenTabla,
  resumenMensual,
  meses,
  onToggleGastoFijo,
}) {
  const mesActual = meses[new Date().getMonth()];
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaTable className="text-teal-400" /> Resumen de Gastos Fijos
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded shadow p-4">
        <table className="min-w-full text-sm text-left border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-600">Descripción</th>
              <th className="px-4 py-2 border border-gray-600">Valor</th>
              {meses.map((mes) => (
                <th
                  key={mes}
                  className={`px-2 border border-gray-600 text-center ${
                    mes === mesActual ? 'bg-gray-700/60' : ''
                  }`}
                >
                  {mes}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resumenTabla.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-2 border border-gray-700">{item.Descripción}</td>
                <td className="px-4 py-2 border border-gray-700">{formatCurrency(item.Valor)}</td>
                {meses.map((mes) => (
                  <td
                    key={mes}
                    className={`text-center border border-gray-700 ${
                      mes === mesActual ? 'bg-gray-700/60' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!item[mes]}
                      onChange={() => onToggleGastoFijo(item, mes)}
                      className="w-4 h-4 accent-teal-400"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-700 text-xs font-semibold">
              <td className="px-4 py-2 border border-gray-600">Total por mes</td>
              <td className="px-4 py-2 border border-gray-600" />
              {meses.map((mes) => {
                const total = resumenMensual.find((r) => r.Mes === mes);
                const val = Number(total?.Total_Mensual || 0);
                return (
                  <td
                    key={mes}
                    className={`text-right border border-gray-600 px-2 py-1 ${
                      mes === mesActual ? 'bg-gray-700/60' : ''
                    }`}
                  >
                    {formatCurrency(val)}
                  </td>
                );
              })}
            </tr>
            <tr className="bg-gray-700 text-xs font-semibold">
              <td className="px-4 py-2 border border-gray-600">Pendiente</td>
              <td className="px-4 py-2 border border-gray-600" />
              {meses.map((mes) => {
                const resumen = resumenMensual.find((r) => r.Mes === mes);
                const val = Number(resumen?.Pendiente_gastoFijo || 0);
                return (
                  <td
                    key={mes}
                    className={`text-right border border-gray-600 px-2 py-1 ${
                      mes === mesActual ? 'bg-gray-700/60' : ''
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
