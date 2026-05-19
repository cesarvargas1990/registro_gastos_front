import React from 'react';
import { FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function EstimadoVsRealSection({ resumenRealVsEstimado, meses }) {
  const mesActual = meses[new Date().getMonth()];
  const filaMesActual = resumenRealVsEstimado.find((row) => row.mes === mesActual);
  const renderSoloMesActual = (rowMes, value) =>
    rowMes === mesActual ? formatCurrency(value) : '-';
  const calcularDisponibleGastos = (row) =>
    Number(row.ingreso_real ?? 0) -
    Number(row.meta_ahorro_est ?? 0) -
    Number(row.gastos_fijos_est ?? 0) -
    Number(row.gastos_adicionales ?? 0);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-base font-black text-[#071843]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
            <FaTable />
          </span>
          Estimado vs Real
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs text-[#172756]">
          <thead className="bg-indigo-50/70 text-[11px] font-black text-[#27356d]">
            <tr>
              <th className="border border-indigo-100 px-3 py-2">Mes</th>
              <th className="border border-indigo-100 px-3 py-2">Ingreso Neto Est</th>
              <th className="border border-indigo-100 px-3 py-2">Ingreso Real</th>
              <th className="border border-indigo-100 px-3 py-2">Diff Ingreso</th>
              <th className="border border-indigo-100 px-3 py-2">Meta Ahorro Est</th>
              <th className="border border-indigo-100 px-3 py-2">Ahorro Real</th>
              <th className="border border-indigo-100 px-3 py-2">Diff Ahorro</th>
              <th className="border border-indigo-100 px-3 py-2">Gastos Fijos Est</th>
              <th className="border border-indigo-100 px-3 py-2">Gastos Fijos Real</th>
              <th className="border border-indigo-100 px-3 py-2">Diff Gastos Fijos</th>
              <th className="border border-indigo-100 px-3 py-2">Gastos Adicionales</th>
              <th className="border border-indigo-100 px-3 py-2">Disponible Estimado</th>
              <th className="border border-indigo-100 px-3 py-2">Disponible Gastos</th>
              <th className="border border-indigo-100 px-3 py-2">Saldo Acumulado tras Meta</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const highlightKey = 'disp_desp_cump_meta';
              const lastPositiveIndex = resumenRealVsEstimado.reduce(
                (acc, r, idx) => (Number(r[highlightKey] ?? 0) > 0 ? idx : acc),
                -1
              );
              return resumenRealVsEstimado.map((row, i) => {
                const disponibleValue = row[highlightKey];
                const highlightClass = `px-4 py-2 border border-gray-700 ${
                  i === lastPositiveIndex && Number(disponibleValue ?? 0) > 0
                    ? 'text-green-400'
                    : ''
                }`;
                const cellClass = 'whitespace-nowrap border border-indigo-50 px-3 py-2';
                const rowClass =
                  row.mes === mesActual
                    ? 'bg-gray-700/60 bg-indigo-50/80'
                    : 'odd:bg-white even:bg-slate-50/65';
                return (
                  <tr key={i} className={rowClass}>
                    <td className={`${cellClass} font-bold`}>{row.mes}</td>
                    <td className={cellClass}>{formatCurrency(row.ingreso_neto_est)}</td>
                    <td className={cellClass}>{formatCurrency(row.ingreso_real)}</td>
                    <td
                      className={`${cellClass} ${Number(row.dif_ingreso ?? 0) < 0 ? 'text-rose-500' : ''}`}
                    >
                      {formatCurrency(row.dif_ingreso)}
                    </td>
                    <td className={cellClass}>{formatCurrency(row.meta_ahorro_est)}</td>
                    <td className={cellClass}>{renderSoloMesActual(row.mes, row.ahorro_real)}</td>
                    <td className={cellClass}>{renderSoloMesActual(row.mes, row.dif_ahorro)}</td>
                    <td className={cellClass}>{formatCurrency(row.gastos_fijos_est)}</td>
                    <td className={cellClass}>{formatCurrency(row.gastos_fijos_real)}</td>
                    <td
                      className={`${cellClass} ${Number(row.dif_gastos_fijo ?? 0) < 0 ? 'text-rose-500' : ''}`}
                    >
                      {formatCurrency(row.dif_gastos_fijo)}
                    </td>
                    <td className={cellClass}>{formatCurrency(row.gastos_adicionales)}</td>
                    <td className={cellClass}>{formatCurrency(row.disponible_estimado)}</td>
                    <td
                      className={`${cellClass} ${calcularDisponibleGastos(row) < 0 ? 'text-rose-500' : ''}`}
                    >
                      {formatCurrency(calcularDisponibleGastos(row))}
                    </td>
                    <td
                      className={`whitespace-nowrap border border-indigo-50 px-3 py-2 ${
                        highlightClass.includes('text-green-400')
                          ? 'text-green-400 text-emerald-500'
                          : ''
                      }`}
                    >
                      {formatCurrency(row.disp_desp_cump_meta)}
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
          <tfoot className="bg-indigo-50/80 font-black text-[#172756]">
            <tr className="text-xs">
              <td className="border border-indigo-100 px-3 py-2">Totales</td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ingreso_neto_est ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ingreso_real ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.dif_ingreso ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.meta_ahorro_est ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(filaMesActual?.ahorro_real ?? 0)}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(filaMesActual?.dif_ahorro ?? 0)}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.gastos_fijos_est ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.gastos_fijos_real ?? 0),
                    0
                  )
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.dif_gastos_fijo ?? 0), 0)
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.gastos_adicionales ?? 0),
                    0
                  )
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.disponible_estimado ?? 0),
                    0
                  )
                )}
              </td>
              <td className="whitespace-nowrap border border-indigo-100 px-3 py-2">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + calcularDisponibleGastos(r), 0)
                )}
              </td>
              <td className="border border-indigo-100 px-3 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
