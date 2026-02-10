import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://147.93.1.252:5000';

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
      .get(`${BASE_URL}/gastos-fijos`)
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
      await axios.post(`${BASE_URL}/gastos-fijos`, {
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
      await axios.put(`${BASE_URL}/gastos-fijos/${id}`, {
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
      await axios.delete(`${BASE_URL}/gastos-fijos/${id}`);
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
    <main className="min-h-screen pt-20 md:ml-64 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Gastos Fijos (Categoría 9)</h2>

      <form
        onSubmit={agregarGasto}
        className="bg-gray-800 p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Descripción"
          className="px-4 py-2 rounded bg-gray-700 text-white"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          className="px-4 py-2 rounded bg-gray-700 text-white"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button
          type="submit"
          disabled={guardando}
          className={`font-semibold py-2 px-4 rounded ${
            guardando
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          Agregar
        </button>
      </form>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
        {mensaje && <span className="text-green-400">{mensaje}</span>}
        {error && <span className="text-red-400">{error}</span>}
      </div>

      <div className="overflow-x-auto bg-gray-800 p-4 rounded shadow">
        <table className="min-w-full text-sm text-left table-auto border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr className="bg-gray-700">
              <th className="px-4 py-2 border border-gray-600">id</th>
              <th className="px-4 py-2 border border-gray-600">descripcion</th>
              <th className="px-4 py-2 border border-gray-600 text-right">valor</th>
              <th className="px-4 py-2 border border-gray-600 text-right">anio_gf</th>
              <th className="px-4 py-2 border border-gray-600">⚙️</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => {
              const enEdicion = editId === gasto.id;
              return (
                <tr key={gasto.id} className="border-b border-gray-700">
                  <td className="p-2">{gasto.id}</td>
                  <td className="p-2">
                    {enEdicion ? (
                      <input
                        type="text"
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                      />
                    ) : (
                      gasto.descripcion
                    )}
                  </td>
                  <td className="p-2 text-right">
                    {enEdicion ? (
                      <input
                        type="number"
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-right"
                        value={editValor}
                        onChange={(e) => setEditValor(e.target.value)}
                      />
                    ) : (
                      `$${parseNumber(gasto.valor)?.toLocaleString('es-CO') || 0}`
                    )}
                  </td>
                  <td className="p-2 text-right">{gasto.anio_gf}</td>
                  <td className="p-2">
                    {enEdicion ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => guardarEdicion(gasto.id)}
                          className="text-teal-400 hover:text-teal-600"
                          disabled={guardando}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelarEdicion}
                          className="text-gray-300 hover:text-gray-100"
                          disabled={guardando}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicion(gasto)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarGasto(gasto.id)}
                          className="text-red-400 hover:text-red-600"
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
                <td colSpan={5} className="p-4 text-center text-gray-300">
                  Sin gastos fijos para el año actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
