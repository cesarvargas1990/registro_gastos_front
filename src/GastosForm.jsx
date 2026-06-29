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

const CATEGORIA_RETIRO_BOLSILLO = 'Retiro Bolsillo Objetivo25y26';
const TIPO_AHORRO_BOLSILLO = 'Ahorro / bolsillo';

const normalizarNombre = (value = '') => value.trim().toLowerCase();

const findByNombre = (items, nombre) =>
  items.find((item) => normalizarNombre(item.nombre) === normalizarNombre(nombre));

export default function GastosForm({ modoModal = false, gastoInicial, onClose, onSuccess }) {
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoMovimientoId, setTipoMovimientoId] = useState('');
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [registrarRetiroBolsillo, setRegistrarRetiroBolsillo] = useState(false);
  const [tipoRetiroBolsilloId, setTipoRetiroBolsilloId] = useState('');
  const [fechaFinalPago, setFechaFinalPago] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const limpiarFormulario = () => {
    setDescripcion('');
    setValor('');
    setFecha('');
    setCategoriaId('');
    setTipoMovimientoId('');
    setRegistrarRetiroBolsillo(false);
    setTipoRetiroBolsilloId('');
    setFechaFinalPago('');
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/tipos-movimiento`)
      .then((response) => setTiposMovimiento(response.data || []))
      .catch((err) => console.error('Error cargando tipos de movimiento:', err));

    axios
      .get(`${API_BASE}/categorias`)
      .then((response) => setCategorias(response.data || []))
      .catch((err) => console.error('Error cargando categorías:', err));
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

  useEffect(() => {
    if (!registrarRetiroBolsillo || tipoRetiroBolsilloId) return;

    const tipoAhorroBolsillo = findByNombre(tiposMovimiento, TIPO_AHORRO_BOLSILLO);
    if (tipoAhorroBolsillo) {
      setTipoRetiroBolsilloId(tipoAhorroBolsillo.id.toString());
    }
  }, [registrarRetiroBolsillo, tipoRetiroBolsilloId, tiposMovimiento]);

  const crearPayloadMovimiento = ({
    categoriaMovimientoId,
    tipoMovimientoMovimientoId,
    fechaFinalPagoMovimiento = fechaFinalPago || null,
  }) => ({
    descripcion,
    valor,
    fecha,
    categoria_id: parseInt(categoriaMovimientoId, 10),
    tipo_movimiento_id: tipoMovimientoMovimientoId
      ? parseInt(tipoMovimientoMovimientoId, 10)
      : null,
    fecha_final_pago: fechaFinalPagoMovimiento,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    if (!descripcion || !valor || !fecha || !categoriaId) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    if (registrarRetiroBolsillo) {
      const categoriaRetiroBolsillo = findByNombre(categorias, CATEGORIA_RETIRO_BOLSILLO);

      if (!categoriaRetiroBolsillo) {
        setError(`No se encontró la categoría ${CATEGORIA_RETIRO_BOLSILLO}.`);
        return;
      }
    }

    try {
      setGuardando(true);
      if (gastoInicial) {
        await axios.put(
          `${API_BASE}/movimientos/${gastoInicial.id}`,
          crearPayloadMovimiento({
            categoriaMovimientoId: categoriaId,
            tipoMovimientoMovimientoId: tipoMovimientoId,
          })
        );
      } else {
        if (registrarRetiroBolsillo) {
          const categoriaRetiroBolsillo = findByNombre(categorias, CATEGORIA_RETIRO_BOLSILLO);

          await axios.post(
            `${API_BASE}/movimientos`,
            crearPayloadMovimiento({
              categoriaMovimientoId: categoriaRetiroBolsillo.id,
              tipoMovimientoMovimientoId: tipoRetiroBolsilloId,
              fechaFinalPagoMovimiento: null,
            })
          );
        }

        await axios.post(
          `${API_BASE}/movimientos`,
          crearPayloadMovimiento({
            categoriaMovimientoId: categoriaId,
            tipoMovimientoMovimientoId: tipoMovimientoId,
          })
        );

        setExito(
          registrarRetiroBolsillo
            ? '¡Retiro y gasto registrados exitosamente!'
            : '¡Gasto registrado exitosamente!'
        );
        limpiarFormulario();
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el gasto');
    } finally {
      setGuardando(false);
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
          {!gastoInicial && (
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 accent-teal-500"
                checked={registrarRetiroBolsillo}
                onChange={(e) => setRegistrarRetiroBolsillo(e.target.checked)}
              />
              Gasto desde bolsillo
            </label>
          )}
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
          {registrarRetiroBolsillo && !gastoInicial && (
            <select
              aria-label="Tipo retiro bolsillo"
              className={`${inputClass} w-full`}
              value={tipoRetiroBolsilloId}
              onChange={(e) => setTipoRetiroBolsilloId(e.target.value)}
            >
              <option value="">Tipo retiro bolsillo</option>
              {tiposMovimiento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          )}
          <FiltroCategorias
            value={categoriaId}
            onChange={setCategoriaId}
            className="w-full"
            categorias={categorias}
          />
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
              disabled={guardando}
              className="h-11 rounded-xl bg-teal-500 px-5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-600"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
