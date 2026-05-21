import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FiltroCategorias from './FiltroCategorias';
import { API_BASE } from './utils/api';

const pageClass =
  'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:flex md:items-center md:justify-center md:px-8 md:pt-8';
const panelClass =
  'w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6';
const inputClass =
  'h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

export default function GastosForm({ modoModal = false, gastoInicial, onClose, onSuccess }) {
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoMovimientoId, setTipoMovimientoId] = useState('');
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [fechaFinalPago, setFechaFinalPago] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const limpiarFormulario = () => {
    setDescripcion('');
    setValor('');
    setFecha('');
    setCategoriaId('');
    setTipoMovimientoId('');
    setFechaFinalPago('');
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/tipos-movimiento`)
      .then((response) => setTiposMovimiento(response.data || []))
      .catch((err) => console.error('Error cargando tipos de movimiento:', err));
  }, []);

  useEffect(() => {
    if (gastoInicial) {
      setDescripcion(gastoInicial.descripcion || '');
      setValor(gastoInicial.valor || '');
      setFecha(formatoFechaInput(gastoInicial.fecha) || '');
      setCategoriaId(gastoInicial.categoria_id?.toString() || '');
      setTipoMovimientoId(gastoInicial.tipo_movimiento_id?.toString() || '');
      setFechaFinalPago(formatoFechaInput(gastoInicial.fecha_final_pago) || '');
    }
  }, [gastoInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    if (!descripcion || !valor || !fecha || !categoriaId) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    try {
      if (gastoInicial) {
        await axios.put(`${API_BASE}/movimientos/${gastoInicial.id}`, {
          descripcion,
          valor,
          fecha,
          categoria_id: parseInt(categoriaId),
          tipo_movimiento_id: tipoMovimientoId ? parseInt(tipoMovimientoId) : null,
          fecha_final_pago: fechaFinalPago || null,
        });
      } else {
        await axios.post(`${API_BASE}/movimientos`, {
          descripcion,
          valor,
          fecha,
          categoria_id: parseInt(categoriaId),
          tipo_movimiento_id: tipoMovimientoId ? parseInt(tipoMovimientoId) : null,
          fecha_final_pago: fechaFinalPago || null,
        });

        setExito('¡Gasto registrado exitosamente!');
        limpiarFormulario();
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el gasto');
    }
  };

  function formatoFechaInput(fechaStr) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    const iso = fecha.toISOString(); // Ej: 2025-01-15T00:00:00.000Z
    return iso.split('T')[0]; // Retorna: "2025-01-15"
  }
  return (
    <main className={modoModal ? '' : pageClass}>
      <div className={`${panelClass} ${modoModal ? '' : 'max-w-2xl'}`}>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Movimiento</p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-[#061640]">
            {gastoInicial ? 'Editar Movimiento' : 'Registrar Movimiento'}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Completa los datos del movimiento financiero.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {exito && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
            {exito}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Descripción *"
            className={inputClass}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor *"
            className={inputClass}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <input
            type="date"
            className={inputClass}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <FiltroCategorias value={categoriaId} onChange={setCategoriaId} className="w-full" />
          <select
            className={`${inputClass} w-full`}
            value={tipoMovimientoId}
            onChange={(e) => setTipoMovimientoId(e.target.value)}
          >
            <option value="">Selecciona un tipo de movimiento</option>
            {tiposMovimiento.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Fecha Final de Pago (opcional)"
            className={inputClass}
            value={fechaFinalPago}
            onChange={(e) => setFechaFinalPago(e.target.value)}
          />
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-teal-500 px-5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
