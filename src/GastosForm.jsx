import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FiltroCategorias from './FiltroCategorias';

export default function GastosForm({ modoModal = false, gastoInicial, onClose, onSuccess }) {
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [fechaFinalPago, setFechaFinalPago] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const limpiarFormulario = () => {
    setDescripcion('');
    setValor('');
    setFecha('');
    setCategoriaId('');
    setFechaFinalPago('');
  };

  useEffect(() => {
    if (gastoInicial) {
      console.log(gastoInicial);
      setDescripcion(gastoInicial.descripcion || '');
      setValor(gastoInicial.valor || '');
      setFecha(formatoFechaInput(gastoInicial.fecha) || '');
      setCategoriaId(gastoInicial.categoria_id?.toString() || '');
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
        console.log(gastoInicial);
        console.log(descripcion, valor, fecha, categoriaId, fechaFinalPago);
        await axios.put(`http://147.93.1.252:5000/movimientos/${gastoInicial.id}`, {
          descripcion,
          valor,
          fecha,
          categoria_id: parseInt(categoriaId),
          fecha_final_pago: fechaFinalPago || null,
        });
      } else {
        console.log(descripcion, valor, fecha, categoriaId, fechaFinalPago);
        await axios.post('http://147.93.1.252:5000/movimientos', {
          descripcion,
          valor,
          fecha,
          categoria_id: parseInt(categoriaId),
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
    <main
      className={`${modoModal ? '' : 'min-h-screen flex items-center justify-center pt-20 md:ml-64 px-4'}`}
    >
      <div className={`bg-gray-800 p-6 rounded shadow w-full ${modoModal ? '' : 'max-w-xl'}`}>
        <h2 className="text-xl font-bold text-white mb-4">
          {gastoInicial ? 'Editar Movimiento' : 'Registrar Movimiento'}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {exito && <div className="mb-4 text-green-400 text-center font-semibold">{exito}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Descripción *"
            className="px-4 py-2 rounded bg-gray-700 text-white"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor *"
            className="px-4 py-2 rounded bg-gray-700 text-white"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <input
            type="date"
            className="px-4 py-2 rounded bg-gray-700 text-white"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <FiltroCategorias value={categoriaId} onChange={setCategoriaId} className="w-full" />
          <input
            type="date"
            placeholder="Fecha Final de Pago (opcional)"
            className="px-4 py-2 rounded bg-gray-700 text-white"
            value={fechaFinalPago}
            onChange={(e) => setFechaFinalPago(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
