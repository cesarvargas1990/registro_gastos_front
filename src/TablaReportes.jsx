import React, { useState, useMemo, useEffect } from 'react';
import FiltroCategorias from './FiltroCategorias';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import GastosForm from './GastosForm';
import { API_BASE } from './utils/api';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const inputClass =
  'h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const numericFields = new Set(['id', 'valor']);
const dateFields = new Set(['fecha', 'fecha_final_pago']);

const parseSortNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;

  const normalizedValue = String(value).replace(/[^\d.-]/g, '');
  const number = Number(normalizedValue);
  return Number.isFinite(number) ? number : 0;
};

const getSortValue = (item, field) => {
  const value = item[field];

  if (numericFields.has(field)) {
    return parseSortNumber(value);
  }

  if (dateFields.has(field)) {
    return new Date(value || 0).getTime();
  }

  return String(value ?? '').toLocaleLowerCase('es-CO');
};

const getTipoMovimientoKey = (item) => {
  if (item?.tipo_movimiento_id !== null && item?.tipo_movimiento_id !== undefined) {
    return String(item.tipo_movimiento_id);
  }

  return item?.nombre_tipo_movimiento ? `nombre:${item.nombre_tipo_movimiento}` : '';
};

const getMovimientoIdValido = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

export default function TablaReportes() {
  const [movimientos, setMovimientos] = useState([]);
  const [searchDesc, setSearchDesc] = useState('');
  const [searchCat, setSearchCat] = useState('');
  const [searchTipoMovimiento, setSearchTipoMovimiento] = useState('');
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
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
    { label: 'Tipo Movimiento', field: 'nombre_tipo_movimiento' },
    { label: 'Fecha Final de Pago', field: 'fecha_final_pago' },
  ];

  useEffect(() => {
    cargarMovimientos();
    cargarTiposMovimiento();
  }, []);

  const cargarMovimientos = () => {
    axios
      .get(`${API_BASE}/movimientos`)
      .then((response) => setMovimientos(response.data))
      .catch((error) => console.error('Error cargando movimientos:', error));
  };

  const cargarTiposMovimiento = () => {
    axios
      .get(`${API_BASE}/tipos-movimiento`)
      .then((response) => setTiposMovimiento(response.data || []))
      .catch((error) => console.error('Error cargando tipos de movimiento:', error));
  };

  const tiposMovimientoOptions = useMemo(() => {
    const options = new Map();

    tiposMovimiento.forEach((tipo) => {
      if (tipo?.id && tipo?.nombre) {
        options.set(String(tipo.id), tipo.nombre);
      }
    });

    movimientos.forEach((movimiento) => {
      const key = getTipoMovimientoKey(movimiento);
      if (key && movimiento.nombre_tipo_movimiento && !options.has(key)) {
        options.set(key, movimiento.nombre_tipo_movimiento);
      }
    });

    return Array.from(options, ([value, label]) => ({ value, label }));
  }, [tiposMovimiento, movimientos]);

  const confirmarEliminar = (mov) => {
    setMovAEliminar(mov);
    setMostrarModal(true);
  };

  const eliminarConfirmado = async () => {
    const movimientoId = getMovimientoIdValido(movAEliminar?.id);

    if (!movimientoId) {
      console.error('Id de movimiento inválido');
      return;
    }

    try {
      await axios.delete(`${API_BASE}/movimientos/${movimientoId}`);
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
      const cumpleTipoMovimiento =
        searchTipoMovimiento === '' || getTipoMovimientoKey(item) === searchTipoMovimiento;
      const cumpleFechaInicio = !fechaInicio || new Date(item.fecha) >= new Date(fechaInicio);
      const cumpleFechaFin = !fechaFin || new Date(item.fecha) <= new Date(fechaFin);
      return (
        cumpleDescripcion &&
        cumpleCategoria &&
        cumpleTipoMovimiento &&
        cumpleFechaInicio &&
        cumpleFechaFin
      );
    });

    return filtered.sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue, 'es-CO', { numeric: true }) * direction;
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
  }, [
    movimientos,
    searchDesc,
    searchCat,
    searchTipoMovimiento,
    sortField,
    sortDirection,
    fechaInicio,
    fechaFin,
  ]);

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
    setSearchTipoMovimiento('');
    setFechaInicio('');
    setFechaFin('');
    setItemsPerPage(20);
    setCurrentPage(1);
  };

  return (
    <main className={pageClass}>
      <header className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Movimientos</p>
        <h2 className="text-3xl font-black tracking-normal text-[#061640]">
          Reporte de Movimientos
        </h2>
        <p className="text-sm font-medium text-slate-400">
          Filtra, ordena y administra tus registros.
        </p>
      </header>

      <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/70 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          placeholder="Filtrar por descripción..."
          className={`${inputClass} w-full`}
          value={searchDesc}
          onChange={(e) => setSearchDesc(e.target.value.toLowerCase())}
        />

        <FiltroCategorias className="w-full" onChange={(val) => setSearchCat(val)} />

        <select
          className={`${inputClass} w-full`}
          value={searchTipoMovimiento}
          onChange={(e) => {
            setSearchTipoMovimiento(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Selecciona un tipo de movimiento</option>
          {tiposMovimientoOptions.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>

        <select
          className={`${inputClass} w-full`}
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
          className={`${inputClass} w-full`}
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className={`${inputClass} w-full`}
        />

        <button
          onClick={limpiarFiltros}
          className="h-12 w-full rounded-xl bg-red-500 px-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-600 xl:col-span-2"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="cursor-pointer whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide"
                  >
                    {col.label}{' '}
                    {sortField === col.field ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
                <th className="border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.map((mov) => (
                <tr key={mov.id} className="transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500">
                    {mov.id}
                  </td>
                  <td className="min-w-60 px-4 py-3 font-semibold text-slate-900">
                    {mov.descripcion}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#061640]">{`$${parseFloat(mov.valor).toLocaleString('es-CO')}`}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {mov.fecha ? new Date(mov.fecha).toLocaleDateString('es-ES') : ''}
                  </td>
                  <td className="min-w-48 px-4 py-3">{mov.nombre_categoria}</td>
                  <td className="min-w-52 px-4 py-3">
                    {mov.nombre_tipo_movimiento || 'Sin clasificar'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {mov.fecha_final_pago
                      ? new Date(mov.fecha_final_pago).toLocaleDateString('es-ES')
                      : ''}
                  </td>
                  <td className="flex gap-2 px-4 py-3">
                    <button
                      onClick={() => setMovAEditar(mov)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmarEliminar(mov)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {total !== null && (
                <tr className="bg-[#061640] font-bold text-white">
                  <td className="px-4 py-3" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">{`$${total.toLocaleString('es-CO')}`}</td>
                  <td className="px-4 py-3" colSpan={5}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold shadow-sm transition ${
              currentPage === i + 1
                ? 'bg-teal-500 text-white shadow-teal-100'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061640]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <h3 className="mb-4 text-xl font-black text-[#061640]">¿Eliminar este gasto?</h3>
            <p className="mb-5 text-sm font-medium text-slate-500">
              <strong>Descripción:</strong> {movAEliminar.descripcion}
              <br />
              <strong>Valor:</strong> ${parseFloat(movAEliminar.valor).toLocaleString('es-CO')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarConfirmado}
                className="h-11 rounded-xl bg-red-500 px-5 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {movAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#061640]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
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
