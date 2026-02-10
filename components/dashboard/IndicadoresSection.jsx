import React from 'react';
import { FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';

export default function IndicadoresSection({ indicadores, iconMap, labelMap }) {
  return (
    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FaTachometerAlt className="text-teal-400" /> Indicadores Financieros
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(indicadores[0] || {}).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              {iconMap[key] || <FaChartLine className="text-teal-400" />}
              {labelMap[key] || key}
            </p>
            <p className="text-base font-semibold text-teal-300 break-words">
              {formatCurrency(value, { minimumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
