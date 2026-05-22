import React, { useEffect, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { FaChartPie } from 'react-icons/fa';
import { getJson } from '../../utils/api';
import { formatCurrency } from '../../utils/format';
import { MESES } from '../../utils/meses';

const inputClass =
  'h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-[#172756] shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const chartColors = [
  '#14b8a6',
  '#6366f1',
  '#f97316',
  '#22c55e',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
  '#eab308',
  '#0f766e',
  '#2563eb',
  '#be123c',
  '#64748b',
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function MovimientosTipoPieSection() {
  const [anios, setAnios] = useState([currentYear]);
  const [categorias, setCategorias] = useState([]);
  const [anio, setAnio] = useState(currentYear);
  const [mes, setMes] = useState(currentMonth);
  const [categoriaId, setCategoriaId] = useState('2');
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJson('/anios-movimientos')
      .then((data) => {
        const aniosDisponibles = data.map((item) => Number(item.anio)).filter(Boolean);
        if (aniosDisponibles.length) {
          setAnios(aniosDisponibles);
          setAnio(aniosDisponibles.includes(currentYear) ? currentYear : aniosDisponibles[0]);
        }
      })
      .catch((err) => console.error('Error al obtener años de movimientos', err));

    getJson('/categorias')
      .then((data) => {
        setCategorias(data || []);
        const categoriaGasto = data?.find((item) => item.nombre?.toLowerCase() === 'gasto');
        if (categoriaGasto) {
          setCategoriaId(String(categoriaGasto.id));
        } else if (data?.length) {
          setCategoriaId(String(data[0].id));
        }
      })
      .catch((err) => console.error('Error al obtener categorías para gráfica', err));
  }, []);

  useEffect(() => {
    if (!anio || !mes || !categoriaId) return;

    setLoading(true);
    getJson('/movimientos-por-tipo', {
      params: {
        anio,
        mes,
        categoria_id: categoriaId,
      },
    })
      .then((data) => setDatos(data || []))
      .catch((err) => {
        console.error('Error al obtener movimientos por tipo', err);
        setDatos([]);
      })
      .finally(() => setLoading(false));
  }, [anio, mes, categoriaId]);

  const total = useMemo(
    () => datos.reduce((acc, item) => acc + Number(item.total_valor || 0), 0),
    [datos]
  );

  const chartData = useMemo(
    () => ({
      labels: datos.map((item) => item.tipo_movimiento),
      datasets: [
        {
          data: datos.map((item) => Number(item.total_valor || 0)),
          backgroundColor: datos.map((_, index) => chartColors[index % chartColors.length]),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    }),
    [datos]
  );

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-base font-black text-[#071843]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
              <FaChartPie />
            </span>
            Movimientos por Tipo
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            Total agrupado por tipo de movimiento: {formatCurrency(total)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <select
            className={inputClass}
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          >
            {anios.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {MESES.map((nombreMes, index) => (
              <option key={nombreMes} value={index + 1}>
                {nombreMes}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {datos.length ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1fr)] lg:items-center">
          <div className="h-80">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#23315f',
                      boxWidth: 10,
                      boxHeight: 10,
                      usePointStyle: true,
                      font: { size: 11, weight: '700' },
                    },
                  },
                  tooltip: {
                    backgroundColor: '#172756',
                    titleColor: '#ffffff',
                    bodyColor: '#dbeafe',
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                      label: (context) => {
                        const value = Number(context.raw || 0);
                        const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';
                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#172756]">
              <thead className="bg-indigo-50/70 text-xs font-black text-[#27356d]">
                <tr>
                  <th className="border border-indigo-100 px-3 py-2">Tipo</th>
                  <th className="border border-indigo-100 px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <tr
                    key={item.tipo_movimiento_id ?? item.tipo_movimiento}
                    className="odd:bg-white even:bg-slate-50/65"
                  >
                    <td className="border border-indigo-50 px-3 py-2 font-semibold">
                      {item.tipo_movimiento}
                    </td>
                    <td className="border border-indigo-50 px-3 py-2 font-bold">
                      {formatCurrency(item.total_valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-400">
          {loading
            ? 'Cargando movimientos...'
            : 'No hay movimientos para los filtros seleccionados'}
        </div>
      )}
    </section>
  );
}
