import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './utils/api';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const inputClass =
  'h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100';
const tableInputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const parseNumber = (value) => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^\d.-]/g, '');
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function GastosFijosTable() {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editValor, setEditValor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarGastos = () => {
    axios
      .get(`${API_BASE}/gastos-fijos`)
      .then((response) => {
        setGastos(response.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error cargando gastos fijos:', err);
        setError('Error al cargar los gastos fijos.');
      });
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  const iniciarEdicion = (gasto) => {
    setEditId(gasto.id);
    setEditDescripcion(gasto.descripcion || '');
    setEditValor(gasto.valor ?? '');
    setMensaje('');
    setError('');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditDescripcion('');
    setEditValor('');
  };

  const agregarGasto = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!descripcion || !valor) {
      setError('Descripción y valor son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      await axios.post(`${API_BASE}/gastos-fijos`, {
        descripcion,
        valor: parseNumber(valor),
      });
      setDescripcion('');
      setValor('');
      setMensaje('Gasto fijo agregado.');
      cargarGastos();
    } catch (err) {
      console.error('Error agregando gasto fijo:', err);
      setError('Error al agregar el gasto fijo.');
    } finally {
      setGuardando(false);
    }
  };

  const guardarEdicion = async (id) => {
    setMensaje('');
    setError('');

    if (!editDescripcion || !editValor) {
      setError('Descripción y valor son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      await axios.put(`${API_BASE}/gastos-fijos/${id}`, {
        descripcion: editDescripcion,
        valor: parseNumber(editValor),
      });
      setMensaje('Gasto fijo actualizado.');
      cancelarEdicion();
      cargarGastos();
    } catch (err) {
      console.error('Error actualizando gasto fijo:', err);
      setError('Error al actualizar el gasto fijo.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarGasto = async (id) => {
    setMensaje('');
    setError('');
    setGuardando(true);
    try {
      await axios.delete(`${API_BASE}/gastos-fijos/${id}`);
      setMensaje('Gasto fijo eliminado.');
      cargarGastos();
    } catch (err) {
      console.error('Error eliminando gasto fijo:', err);
      setError('Error al eliminar el gasto fijo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className={pageClass}>
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Presupuesto</p>
        <h2 className="mt-1 text-3xl font-black tracking-normal text-[#061640]">
          Gastos Fijos (Categoría 9)
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-400">
          Administra los gastos recurrentes del año.
        </p>
      </header>

      <form
        onSubmit={agregarGasto}
        className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/70 md:grid-cols-3"
      >
        <input
          type="text"
          placeholder="Descripción"
          className={inputClass}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          className={inputClass}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button
          type="submit"
          disabled={guardando}
          className={`h-12 rounded-xl px-4 text-sm font-bold shadow-sm transition ${
            guardando
              ? 'cursor-not-allowed bg-slate-200 text-slate-400'
              : 'bg-teal-500 text-white shadow-teal-100 hover:bg-teal-600'
          }`}
        >
          Agregar
        </button>
      </form>

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
                <th className="border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide">
                  id
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide">
                  descripcion
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-black uppercase tracking-wide">
                  valor
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-black uppercase tracking-wide">
                  anio_gf
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {gastos.map((gasto) => {
                const enEdicion = editId === gasto.id;
                return (
                  <tr key={gasto.id} className="transition hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500">
                      {gasto.id}
                    </td>
                    <td className="min-w-72 px-4 py-3 font-semibold text-slate-900">
                      {enEdicion ? (
                        <input
                          type="text"
                          className={tableInputClass}
                          value={editDescripcion}
                          onChange={(e) => setEditDescripcion(e.target.value)}
                        />
                      ) : (
                        gasto.descripcion
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#061640]">
                      {enEdicion ? (
                        <input
                          type="number"
                          className={`${tableInputClass} text-right`}
                          value={editValor}
                          onChange={(e) => setEditValor(e.target.value)}
                        />
                      ) : (
                        `$${parseNumber(gasto.valor)?.toLocaleString('es-CO') || 0}`
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">{gasto.anio_gf}</td>
                    <td className="px-4 py-3">
                      {enEdicion ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => guardarEdicion(gasto.id)}
                            className="h-9 rounded-lg bg-teal-50 px-3 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
                            disabled={guardando}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="h-9 rounded-lg bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
                            disabled={guardando}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => iniciarEdicion(gasto)}
                            className="h-9 rounded-lg bg-blue-50 px-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarGasto(gasto.id)}
                            className="h-9 rounded-lg bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                            disabled={guardando}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {gastos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-semibold text-slate-400">
                    Sin gastos fijos para el año actual.
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
