import React, { useState, useMemo, useEffect } from 'react';
import FiltroCategorias from './FiltroCategorias';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import GastosForm from './GastosForm';

export default function TablaReportes() {
  const [movimientos, setMovimientos] = useState([]);
  const [searchDesc, setSearchDesc] = useState('');
  const [searchCat, setSearchCat] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [movAEliminar, setMovAEliminar] = useState(null);
  const [movAEditar, setMovAEditar] = useState(null);
  const [total, setTotal] = useState(0);

  const columns = [
    { label: 'id', field: 'id' },
    { label: 'Descripción', field: 'descripcion' },
    { label: 'Valor', field: 'valor' },
    { label: 'Fecha', field: 'fecha' },
    { label: 'Categoria', field: 'nombre_categoria' },
    { label: 'Fecha Final de Pago', field: 'fecha_final_pago' },
  ];

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = () => {
    axios
      .get('http://147.93.1.252:5000/movimientos')
      .then((response) => setMovimientos(response.data))
      .catch((error) => console.error('Error cargando movimientos:', error));
  };

  const confirmarEliminar = (mov) => {
    setMovAEliminar(mov);
    setMostrarModal(true);
  };

  const eliminarConfirmado = async () => {
    try {
      await axios.delete(`http://147.93.1.252:5000/movimientos/${movAEliminar.id}`);
      cargarMovimientos();
      setMostrarModal(false);
      setMovAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const filteredData = useMemo(() => {
    let filtered = movimientos.filter((item) => {
      const cumpleDescripcion = item.descripcion?.toLowerCase().includes(searchDesc);
      const cumpleCategoria = searchCat === '' || item.categoria_id?.toString() === searchCat;
      const cumpleFechaInicio = !fechaInicio || new Date(item.fecha) >= new Date(fechaInicio);
      const cumpleFechaFin = !fechaFin || new Date(item.fecha) <= new Date(fechaFin);
      return cumpleDescripcion && cumpleCategoria && cumpleFechaInicio && cumpleFechaFin;
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const isDateField = ['fecha', 'fecha_final_pago'].includes(sortField);
      const aValue = isDateField ? new Date(aVal || 0) : (aVal ?? '');
      const bValue = isDateField ? new Date(bVal || 0) : (bVal ?? '');

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [movimientos, searchDesc, searchCat, sortField, sortDirection, fechaInicio, fechaFin]);

  useEffect(() => {
    const nuevoTotal = filteredData.reduce((acc, mov) => acc + (parseFloat(mov.valor) || 0), 0);
    setTotal(nuevoTotal);
  }, [filteredData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(col);
      setSortDirection('asc');
    }
  };

  const limpiarFiltros = () => {
    setSearchDesc('');
    setSearchCat('');
    setFechaInicio('');
    setFechaFin('');
    setItemsPerPage(20);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen pt-20 md:ml-64 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Reporte de Movimientos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por descripción..."
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
          value={searchDesc}
          onChange={(e) => setSearchDesc(e.target.value.toLowerCase())}
        />

        <FiltroCategorias className="w-full" onChange={(val) => setSearchCat(val)} />

        <select
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[10, 20, 30, 50].map((num) => (
            <option key={num} value={num}>
              {num} por página
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white w-full"
        />

        <button
          onClick={limpiarFiltros}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800 p-4 rounded shadow">
        <table className="min-w-full text-sm text-left table-auto border border-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr className="bg-gray-700">
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="px-4 py-2 border border-gray-600 cursor-pointer"
                >
                  {col.label} {sortField === col.field ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
              <th className="px-4 py-2 border border-gray-600">⚙️</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((mov) => (
              <tr key={mov.id} className="border-b border-gray-700">
                <td className="p-2">{mov.id}</td>
                <td className="p-2">{mov.descripcion}</td>
                <td className="p-2 text-right">{`$${parseFloat(mov.valor).toLocaleString('es-CO')}`}</td>
                <td className="p-2">
                  {mov.fecha ? new Date(mov.fecha).toLocaleDateString('es-ES') : ''}
                </td>
                <td className="p-2">{mov.nombre_categoria}</td>
                <td className="p-2">
                  {mov.fecha_final_pago
                    ? new Date(mov.fecha_final_pago).toLocaleDateString('es-ES')
                    : ''}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setMovAEditar(mov)}
                    className="text-blue-400 hover:text-blue-600"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmarEliminar(mov)}
                    className="text-red-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {total !== null && (
              <tr className="bg-gray-700 text-white font-bold">
                <td className="p-2" colSpan={2}>
                  Total
                </td>
                <td className="p-2 text-right">{`$${total.toLocaleString('es-CO')}`}</td>
                <td className="p-2" colSpan={4}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-teal-500' : 'bg-gray-700'} text-white`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-6 w-80 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4">¿Eliminar este gasto?</h3>
            <p className="mb-4 text-sm">
              <strong>Descripción:</strong> {movAEliminar.descripcion}
              <br />
              <strong>Valor:</strong> ${parseFloat(movAEliminar.valor).toLocaleString('es-CO')}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarConfirmado}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {movAEditar && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center overflow-y-auto p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl shadow-xl">
            <GastosForm
              gastoInicial={movAEditar}
              onClose={() => setMovAEditar(null)}
              onSuccess={() => {
                cargarMovimientos();
                setMovAEditar(null);
              }}
              modoModal={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}
