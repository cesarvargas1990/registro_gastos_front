import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaChartBar, FaChartLine } from 'react-icons/fa';

export default function ChartsSection({ resumenMensual, resumenGastos }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaChartBar className="text-teal-400" /> Total por Mes
        </h2>
        <Bar
          data={{
            labels: resumenMensual.map((r) => r.Mes),
            datasets: [
              {
                label: 'Total Mensual',
                data: resumenMensual.map((r) => r.Total_Mensual_Con_Adicionales),
                backgroundColor: 'rgba(20,184,166,0.6)',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
              x: { ticks: { color: 'white' } },
              y: { ticks: { color: 'white' } },
            },
          }}
        />
      </div>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaChartLine className="text-teal-400" /> Ahorros y Estimaciones
        </h2>
        <Line
          data={{
            labels: resumenGastos.map((r) => r.mes),
            datasets: [
              {
                label: 'Meta Ahorro',
                data: resumenGastos.map((r) => r.meta_ahorro),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
              },
              {
                label: 'Disponible Estimado Cubriendo Gastos',
                data: resumenGastos.map((r) => r.disponible_estimado_cubriendo_gastos),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4,
              },
              {
                label: 'Disponible Estimado Sin Cubrir Gastos',
                data: resumenGastos.map((r) => r.disponible_estimado_sin_cubrir_gastos),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
              x: { ticks: { color: 'white' } },
              y: { ticks: { color: 'white' } },
            },
          }}
        />
      </div>
    </section>
  );
}
