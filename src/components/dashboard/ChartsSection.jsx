import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaChartBar, FaChartLine } from 'react-icons/fa';

const axisColor = '#23315f';
const gridColor = 'rgba(148, 163, 184, 0.18)';

const commonScales = {
  x: {
    grid: { display: false },
    ticks: { color: axisColor, font: { size: 11, weight: '600' } },
    border: { display: false },
  },
  y: {
    grid: { color: gridColor, drawBorder: false },
    ticks: {
      color: axisColor,
      font: { size: 11, weight: '600' },
      callback: (value) => Number(value).toLocaleString('es-CO'),
    },
    border: { display: false },
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: axisColor,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        font: { size: 11, weight: '600' },
      },
    },
    tooltip: {
      backgroundColor: '#172756',
      titleColor: '#ffffff',
      bodyColor: '#dbeafe',
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
    },
  },
  scales: commonScales,
};

export default function ChartsSection({ resumenMensual, resumenGastos }) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-base font-black text-[#071843]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
              <FaChartBar />
            </span>
            Total por Mes
          </h2>
        </div>
        <div className="h-72">
          <Bar
            data={{
              labels: resumenMensual.map((r) => r.Mes),
              datasets: [
                {
                  label: 'Total Mensual',
                  data: resumenMensual.map((r) => r.Total_Mensual_Con_Adicionales),
                  backgroundColor: 'rgba(45, 212, 191, 0.92)',
                  borderColor: '#2563eb',
                  borderRadius: 7,
                  maxBarThickness: 38,
                },
              ],
            }}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-base font-black text-[#071843]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-indigo-500">
              <FaChartLine />
            </span>
            Ahorros y Estimaciones
          </h2>
        </div>
        <div className="h-72">
          <Line
            data={{
              labels: resumenGastos.map((r) => r.mes),
              datasets: [
                {
                  label: 'Meta Ahorro',
                  data: resumenGastos.map((r) => r.meta_ahorro),
                  borderColor: '#10b981',
                  backgroundColor: '#10b981',
                  pointRadius: 3,
                  pointHoverRadius: 5,
                  tension: 0.42,
                },
                {
                  label: 'Disponible Estimado Cuentas Gestion',
                  data: resumenGastos.map((r) => r.disponible_estimado_cubriendo_gastos),
                  borderColor: '#8b5cf6',
                  backgroundColor: '#8b5cf6',
                  pointRadius: 3,
                  pointHoverRadius: 5,
                  tension: 0.42,
                },
                {
                  label: 'Disponible Estimado Sin Contar Gestion',
                  data: resumenGastos.map((r) => r.disponible_estimado_sin_cubrir_gastos),
                  borderColor: '#2563eb',
                  backgroundColor: '#2563eb',
                  pointRadius: 3,
                  pointHoverRadius: 5,
                  tension: 0.42,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </section>
  );
}
