import React, { useState, useMemo, useEffect } from 'react';
import FiltroCategorias from './FiltroCategorias';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import GastosForm from './GastosForm';
import { API_BASE } from './utils/api';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const inputClass =
  'h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

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
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorReporte, setErrorReporte] = useState('');
  const [reloadVersion, setReloadVersion] = useState(0);
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
    let vigente = true;
    const params = {
      page: currentPage,
      per_page: itemsPerPage,
      descripcion: searchDesc,
      categoria_id: searchCat,
      tipo_movimiento: searchTipoMovimiento,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      sort: sortField,
      direction: sortDirection,
    };

    setLoading(true);
    setErrorReporte('');
    axios
      .get(`${API_BASE}/movimientos`, { params })
      .then((response) => {
        if (!vigente) return;
        const data = response.data || {};
        setMovimientos(data.items || []);
        setTotalRecords(Number(data.total) || 0);
        setTotalPages(Number(data.total_pages) || 0);
        setTotal(Number(data.total_valor) || 0);
        if (data.page && Number(data.page) !== currentPage) {
          setCurrentPage(Number(data.page));
        }
      })
      .catch((error) => {
        if (!vigente) return;
        console.error('Error cargando movimientos:', error);
        setErrorReporte('No se pudo cargar el reporte. Intenta de nuevo.');
        setMovimientos([]);
        setTotalRecords(0);
        setTotalPages(0);
        setTotal(0);
      })
      .finally(() => {
        if (vigente) setLoading(false);
      });

    return () => {
      vigente = false;
    };
  }, [
    currentPage,
    itemsPerPage,
    searchDesc,
    searchCat,
    searchTipoMovimiento,
    fechaInicio,
    fechaFin,
    sortField,
    sortDirection,
    reloadVersion,
  ]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/tipos-movimiento`)
      .then((response) => setTiposMovimiento(response.data || []))
      .catch((error) => console.error('Error cargando tipos de movimiento:', error));
  }, []);

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
      setReloadVersion((version) => version + 1);
      setMostrarModal(false);
      setMovAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const paginatedData = movimientos;

  const pageButtons = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 'right-gap', totalPages];
    if (currentPage >= totalPages - 2) {
      return [1, 'left-gap', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 'left-gap', currentPage - 1, currentPage, currentPage + 1, 'right-gap', totalPages];
  }, [currentPage, totalPages]);

  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(col);
      setSortDirection('asc');
    }
    setCurrentPage(1);
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
          onChange={(e) => {
            setSearchDesc(e.target.value.toLowerCase());
            setCurrentPage(1);
          }}
        />

        <FiltroCategorias
          className="w-full"
          onChange={(val) => {
            setSearchCat(val);
            setCurrentPage(1);
          }}
        />

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
          onChange={(e) => {
            setFechaInicio(e.target.value);
            setCurrentPage(1);
          }}
          className={`${inputClass} w-full`}
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => {
            setFechaFin(e.target.value);
            setCurrentPage(1);
          }}
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
                    className={`cursor-pointer whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wide ${
                      col.field === 'id' ? 'w-20 min-w-20' : ''
                    }`}
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
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center font-semibold text-slate-400">
                    {loading ? 'Cargando movimientos…' : 'No hay movimientos para estos filtros.'}
                  </td>
                </tr>
              )}
              {paginatedData.map((mov) => (
                <tr key={mov.id} className="group transition hover:bg-slate-50/80">
                  <td className="w-20 min-w-20 whitespace-nowrap px-4 py-3 font-semibold text-slate-500">
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

      {errorReporte && (
        <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorReporte}
        </p>
      )}

      <footer className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500" aria-live="polite">
          {loading
            ? 'Actualizando reporte…'
            : totalRecords === 0
              ? 'Sin movimientos'
              : `Mostrando ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                  currentPage * itemsPerPage,
                  totalRecords
                )} de ${totalRecords} movimientos`}
        </p>
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-1.5"
            aria-label="Paginación del reporte"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1 || loading}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-1 text-xs font-semibold text-slate-500 sm:hidden">
              {currentPage} / {totalPages}
            </span>
            <div className="hidden items-center gap-1.5 sm:flex">
              {pageButtons.map((page) =>
                typeof page === 'string' ? (
                  <span key={page} className="px-1 text-slate-400" aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                    aria-label={`Página ${page}`}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold transition ${
                      currentPage === page
                        ? 'bg-teal-500 text-white shadow-sm shadow-teal-100'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages || loading}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </nav>
        )}
        {totalPages > 0 && totalPages <= 1 && (
          <span className="text-xs font-semibold text-slate-400">Página 1 de 1</span>
        )}
      </footer>

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
                setReloadVersion((version) => version + 1);
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
