import React from 'react';
import { FaTable } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function EstimadoVsRealSection({ resumenRealVsEstimado, meses }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaTable className="text-teal-400" /> Estimado vs Real
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded shadow p-4">
        <table className="min-w-full text-sm text-left border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 border border-gray-600">Mes</th>
              <th className="px-4 py-2 border border-gray-600">Ingreso Neto Est</th>
              <th className="px-4 py-2 border border-gray-600">Ingreso Real</th>
              <th className="px-4 py-2 border border-gray-600">Dif Ingreso</th>
              <th className="px-4 py-2 border border-gray-600">Meta Ahorro Est</th>
              <th className="px-4 py-2 border border-gray-600">Ahorro Real</th>
              <th className="px-4 py-2 border border-gray-600">Dif Ahorro</th>
              <th className="px-4 py-2 border border-gray-600">Gastos Fijos Est</th>
              <th className="px-4 py-2 border border-gray-600">Gastos Fijos Real</th>
              <th className="px-4 py-2 border border-gray-600">Dif Gastos Fijo</th>
              <th className="px-4 py-2 border border-gray-600">Gastos Adicionales</th>
              <th className="px-4 py-2 border border-gray-600">Ingresos Extra</th>
              <th className="px-4 py-2 border border-gray-600">Disponible Estimado</th>
              <th className="px-4 py-2 border border-gray-600">Disponible Cuenta</th>
              <th className="px-4 py-2 border border-gray-600">Disp Desp Cump Meta</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const mesActual = meses[new Date().getMonth()];
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
                const rowClass = row.mes === mesActual ? 'bg-gray-700/60' : '';
                return (
                  <tr key={i} className={rowClass}>
                    <td className="px-4 py-2 border border-gray-700">{row.mes}</td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.ingreso_neto_est)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.ingreso_real)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.dif_ingreso)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.meta_ahorro_est)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.ahorro_real)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.dif_ahorro)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.gastos_fijos_est)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.gastos_fijos_real)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.dif_gastos_fijo)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.gastos_adicionales)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.ingresos_extra)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.disponible_estimado)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                      {formatCurrency(row.disponible_cuenta)}
                    </td>
                    <td className={highlightClass}>{formatCurrency(row.disp_desp_cump_meta)}</td>
                  </tr>
                );
              });
            })()}
          </tbody>
          <tfoot className="bg-gray-800 text-white font-bold">
            <tr className="bg-gray-700 text-xs font-semibold">
              <td className="px-4 py-2 border border-gray-700">Totales</td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ingreso_neto_est ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ingreso_real ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.dif_ingreso ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.meta_ahorro_est ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ahorro_real ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.dif_ahorro ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.gastos_fijos_est ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.gastos_fijos_real ?? 0),
                    0
                  )
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.dif_gastos_fijo ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.gastos_adicionales ?? 0),
                    0
                  )
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce((acc, r) => acc + Number(r.ingresos_extra ?? 0), 0)
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.disponible_estimado ?? 0),
                    0
                  )
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {formatCurrency(
                  resumenRealVsEstimado.reduce(
                    (acc, r) => acc + Number(r.disponible_cuenta ?? 0),
                    0
                  )
                )}
              </td>
              <td className="px-4 py-2 border border-gray-700"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
