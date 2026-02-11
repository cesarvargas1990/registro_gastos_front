import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { formatCurrency } from './utils/format';

const BASE_URL = 'http://147.93.1.252:5000';

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
      .get(`${BASE_URL}/meses`)
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

      await axios.put(`${BASE_URL}/meses`, { meses: payload });
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
    <main className="min-h-screen pt-20 md:ml-64 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Meses del Año Actual</h2>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end mb-4">
        {mensaje && <span className="text-green-400">{mensaje}</span>}
        {error && <span className="text-red-400">{error}</span>}
        <button
          onClick={guardarCambios}
          disabled={!hayCambios || guardando}
          className={`px-4 py-2 rounded font-semibold ${
            hayCambios && !guardando
              ? 'bg-teal-500 hover:bg-teal-600 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800 p-4 rounded shadow">
        <table className="min-w-full text-sm text-left table-auto border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr className="bg-gray-700">
              {columnas.map((col) => (
                <th
                  key={col.field}
                  className={`px-4 py-2 border border-gray-600 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meses.map((mes, index) => (
              <tr key={mes.id} className="border-b border-gray-700">
                {columnas.map((col) => (
                  <td
                    key={`${mes.id}-${col.field}`}
                    className={`p-2 border border-gray-700 ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.editable ? (
                      <input
                        type="number"
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-right"
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
                      <span>{mes[col.field]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {meses.length === 0 && (
              <tr>
                <td colSpan={columnas.length} className="p-4 text-center text-gray-300">
                  Sin datos para el año actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
