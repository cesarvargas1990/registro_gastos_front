import React from 'react';
import { FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

const indicatorOrder = [
  'actual_menos_ahorro_real',
  'actual_en_cuenta_ahorros',
  'ahorro_real',
  'faltante_meta_actual',
  'faltante_meta_anio',
  'gastos_fijos_estimados_anio',
  'ingresos_estimados_anio',
  'meta_ahorro_anio',
  'meta_ahorro_hasta_mes_actual',
  'disp_desp_cump_meta_actual',
];

const indicatorStyles = [
  'from-emerald-50 to-cyan-50 text-emerald-500',
  'from-cyan-50 to-sky-50 text-cyan-500',
  'from-rose-50 to-pink-50 text-rose-500',
  'from-orange-50 to-amber-50 text-orange-500',
  'from-violet-50 to-purple-50 text-violet-500',
  'from-blue-50 to-sky-50 text-blue-500',
  'from-green-50 to-emerald-50 text-green-500',
  'from-cyan-50 to-blue-50 text-cyan-500',
  'from-purple-50 to-indigo-50 text-purple-500',
  'from-slate-50 to-blue-50 text-indigo-500',
];

export default function IndicadoresSection({ indicadores, iconMap, labelMap }) {
  const entries = Object.entries(indicadores[0] || {}).sort(([a], [b]) => {
    const indexA = indicatorOrder.indexOf(a);
    const indexB = indicatorOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <h2 className="mb-4 flex items-center gap-3 text-base font-black text-[#071843]">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
          <FaTachometerAlt />
        </span>
        Indicadores Financieros
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className="flex min-h-32 flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:min-h-24 sm:flex-row sm:items-center sm:justify-start sm:p-4"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm sm:h-14 sm:w-14 sm:text-base ${
                indicatorStyles[index % indicatorStyles.length]
              }`}
            >
              {iconMap[key] || <FaChartLine />}
            </span>
            <div className="min-w-0">
              <p className="line-clamp-2 text-[10px] font-bold leading-snug text-slate-500 sm:text-[11px]">
                {labelMap[key] || key}
              </p>
              <p className="mt-1 break-words text-[13px] font-black leading-tight text-[#12b8a6] sm:text-base">
                {formatCurrency(value, { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
