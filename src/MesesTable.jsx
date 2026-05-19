import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { formatCurrency } from './utils/format';
import { API_BASE } from './utils/api';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const numberInputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-right text-sm font-bold text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const parseNumber = (value) => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^\d.-]/g, '');
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function MesesTable() {
  const [meses, setMeses] = useState([]);
  const [mesesIniciales, setMesesIniciales] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const columnas = [
    { label: 'Año', field: 'anio', align: 'right', editable: false },
    {
      label: 'Número Mes',
      field: 'numero_mes',
      align: 'right',
      editable: false,
    },
    { label: 'Nombre', field: 'nombre', align: 'left', editable: false },
    {
      label: 'Meta Ahorro',
      field: 'meta_ahorro',
      align: 'right',
      editable: true,
    },
    {
      label: 'Ingreso Neto',
      field: 'ingreso_neto',
      align: 'right',
      editable: true,
    },
    {
      label: 'Estimado Gastos Fijos',
      field: 'estimado_gastos_fijos',
      align: 'right',
      editable: true,
    },
  ];

  const cargarMeses = () => {
    axios
      .get(`${API_BASE}/meses`)
      .then((response) => {
        setMeses(response.data);
        setMesesIniciales(response.data);
        setMensaje('');
        setError('');
      })
      .catch((err) => {
        console.error('Error cargando meses:', err);
        setError('Error al cargar los meses.');
      });
  };

  useEffect(() => {
    cargarMeses();
  }, []);

  const actualizarCampo = (index, field, value) => {
    setMeses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const hayCambios = useMemo(() => {
    return JSON.stringify(meses) !== JSON.stringify(mesesIniciales);
  }, [meses, mesesIniciales]);

  const guardarCambios = async () => {
    setMensaje('');
    setError('');
    setGuardando(true);

    try {
      const payload = meses.map((mes) => ({
        id: mes.id,
        nombre: mes.nombre,
        meta_ahorro: parseNumber(mes.meta_ahorro),
        ingreso_neto: parseNumber(mes.ingreso_neto),
        estimado_gastos_fijos: parseNumber(mes.estimado_gastos_fijos),
      }));

      await axios.put(`${API_BASE}/meses`, { meses: payload });
      setMensaje('Cambios guardados correctamente.');
      cargarMeses();
    } catch (err) {
      console.error('Error guardando meses:', err);
      setError('Error al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className={pageClass}>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Planeación</p>
          <h2 className="mt-1 text-3xl font-black tracking-normal text-[#061640]">
            Meses del Año Actual
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Ajusta metas, ingresos y estimados mensuales.
          </p>
        </div>
        <button
          onClick={guardarCambios}
          disabled={!hayCambios || guardando}
          className={`h-11 rounded-xl px-5 text-sm font-bold shadow-sm transition ${
            hayCambios && !guardando
              ? 'bg-teal-500 text-white shadow-teal-100 hover:bg-teal-600'
              : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </header>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
        {mensaje && (
          <span className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {mensaje}
          </span>
        )}
        {error && (
          <span className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            {error}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {columnas.map((col) => (
                  <th
                    key={col.field}
                    className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {meses.map((mes, index) => (
                <tr key={mes.id} className="transition hover:bg-slate-50/80">
                  {columnas.map((col) => (
                    <td
                      key={`${mes.id}-${col.field}`}
                      className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      {col.editable ? (
                        <input
                          type="number"
                          className={numberInputClass}
                          value={mes[col.field] ?? ''}
                          onChange={(e) => actualizarCampo(index, col.field, e.target.value)}
                        />
                      ) : // Si el campo es numérico, mostrar con formato de moneda
                      [
                          'meta_ahorro',
                          'ingreso_neto',
                          'estimado_gastos_fijos',
                          'ahorro_real',
                          'dif_ingreso',
                          'dif_ahorro',
                          'gastos_fijos_est',
                          'gastos_fijos_real',
                        ].includes(col.field) ? (
                        <span>{formatCurrency(mes[col.field])}</span>
                      ) : (
                        <span className="font-semibold text-slate-900">{mes[col.field]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {meses.length === 0 && (
                <tr>
                  <td
                    colSpan={columnas.length}
                    className="px-4 py-10 text-center font-semibold text-slate-400"
                  >
                    Sin datos para el año actual.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
