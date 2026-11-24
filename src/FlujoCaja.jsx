import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './utils/api';
import { FaBullseye, FaChartLine, FaCoins, FaHourglassHalf, FaPiggyBank } from 'react-icons/fa';
import { formatCurrency } from './utils/format';
import {
  calcularIndicadores,
  totalDineroEntra,
  totalFilas,
  totalProyeccionGastos,
  totalGastosFijos,
  totalGastosFijosMes,
} from './utils/flujoCaja';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const cardClass =
  'mb-6 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.07)] md:p-6';
const tableInputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const thClass = 'px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-400';
const tdClass = 'px-3 py-2';
const AUTOSAVE_MS = 800;

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const moneyClass = (v) => (v < 0 ? 'text-red-600' : 'text-[#061640]');

const PARAMS = [
  { key: 'cuenta_bolsillo', label: 'Actual cuenta bolsillo' },
  { key: 'meta', label: 'Meta' },
];

const CALCULADOS = [
  {
    key: 'falta_meta_total',
    label: 'Falta meta total',
    icon: FaHourglassHalf,
    tone: 'from-orange-50 to-amber-50 text-orange-500',
  },
  {
    key: 'posible_gran_total',
    label: 'Posible gran total',
    icon: FaCoins,
    tone: 'from-emerald-50 to-cyan-50 text-emerald-500',
  },
  {
    key: 'dif_meta',
    label: 'Dif meta',
    icon: FaBullseye,
    tone: 'from-violet-50 to-purple-50 text-violet-500',
  },
  {
    key: 'a_3_meses',
    label: 'A 3 meses',
    icon: FaChartLine,
    tone: 'from-cyan-50 to-sky-50 text-cyan-500',
  },
  {
    key: 'a_4_meses',
    label: 'A 4 meses',
    icon: FaChartLine,
    tone: 'from-blue-50 to-sky-50 text-blue-500',
  },
  {
    key: 'bolsa',
    label: 'Bolsa',
    icon: FaPiggyBank,
    tone: 'from-rose-50 to-pink-50 text-rose-500',
  },
];

function TablaFilas({ titulo, filas, onChange, onAdd, onRemove, ariaPrefix, totalLabel, totalId }) {
  const total = totalFilas(filas);
  return (
    <section className={cardClass}>
      <h3 className="mb-4 text-lg font-black text-[#061640]">{titulo}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Concepto</th>
              <th className={thClass}>Valor</th>
              <th className={`${thClass} w-24`}>Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map((e, idx) => (
              <tr key={e.id ?? `n-${idx}`}>
                <td className={tdClass}>
                  <input
                    type="text"
                    aria-label={`${ariaPrefix.concepto} ${idx + 1}`}
                    placeholder="Concepto"
                    className={tableInputClass}
                    value={e.concepto ?? ''}
                    onChange={(ev) => onChange(idx, 'concepto', ev.target.value)}
                  />
                </td>
                <td className={tdClass}>
                  <input
                    type="number"
                    aria-label={`${ariaPrefix.valor} ${idx + 1}`}
                    className={`${tableInputClass} text-right`}
                    value={e.valor ?? ''}
                    onChange={(ev) => onChange(idx, 'valor', ev.target.value)}
                  />
                </td>
                <td className={tdClass}>
                  <button
                    type="button"
                    aria-label={`${ariaPrefix.eliminar} ${idx + 1}`}
                    onClick={() => onRemove(idx)}
                    className="h-9 rounded-lg bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="h-9 rounded-lg bg-blue-50 px-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
        >
          Agregar fila
        </button>
        <p className="text-sm font-bold text-slate-500">
          {totalLabel}:{' '}
          <span data-testid={totalId} className={`text-lg font-black ${moneyClass(total)}`}>
            {formatCurrency(total)}
          </span>
        </p>
      </div>
    </section>
  );
}

export default function FlujoCaja() {
  const [entradas, setEntradas] = useState([]);
  const [parametros, setParametros] = useState({
    cuenta_bolsillo: 0,
    meta: 0,
    est_prest_serv: 0,
  });
  const [proyeccion, setProyeccion] = useState([]);
  const [meses, setMeses] = useState([]);
  const [gastosFijos, setGastosFijos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const cargado = useRef(false);
  const omitirSiguiente = useRef(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/flujo-caja`)
      .then((response) => {
        const data = response.data || {};
        omitirSiguiente.current = true;
        setEntradas(data.entradas || []);
        setParametros((prev) => ({ ...prev, ...(data.parametros || {}) }));
        setProyeccion(data.proyeccion_gastos || []);
        setMeses(data.meses || []);
        setGastosFijos(data.gastos_fijos || []);
        cargado.current = true;
        setError('');
      })
      .catch((err) => {
        console.error('Error cargando flujo de caja:', err);
        setError('Error al cargar el flujo de caja.');
      });
  }, []);

  const totalEntra = useMemo(() => totalDineroEntra(entradas), [entradas]);
  const totalProyeccion = useMemo(() => totalProyeccionGastos(proyeccion), [proyeccion]);
  const totalGastos = useMemo(() => totalGastosFijos(gastosFijos), [gastosFijos]);
  const indicadores = useMemo(
    () =>
      calcularIndicadores({
        cuentaBolsillo: parametros.cuenta_bolsillo,
        meta: parametros.meta,
        totalEntra,
        totalGastos,
        totalProyeccion,
      }),
    [parametros, totalEntra, totalGastos, totalProyeccion]
  );

  const updateEntrada = (idx, campo, valor) =>
    setEntradas((prev) => prev.map((e, i) => (i === idx ? { ...e, [campo]: valor } : e)));

  const agregarEntrada = () => setEntradas((prev) => [...prev, { concepto: '', valor: 0 }]);

  const eliminarEntrada = (idx) => setEntradas((prev) => prev.filter((_, i) => i !== idx));

  const updateProyeccion = (idx, campo, valor) =>
    setProyeccion((prev) => prev.map((e, i) => (i === idx ? { ...e, [campo]: valor } : e)));

  const agregarProyeccion = () => setProyeccion((prev) => [...prev, { concepto: '', valor: 0 }]);

  const eliminarProyeccion = (idx) => setProyeccion((prev) => prev.filter((_, i) => i !== idx));

  const updateMes = (gfId, anio, mes, campo, valor) =>
    setGastosFijos((prev) =>
      prev.map((gf) =>
        gf.gasto_fijo_id !== gfId
          ? gf
          : {
              ...gf,
              meses: gf.meses.map((m) =>
                m.anio === anio && m.mes === mes ? { ...m, [campo]: valor } : m
              ),
            }
      )
    );

  const construirPayload = () => ({
    entradas: entradas.map((e) => ({ concepto: e.concepto || '', valor: toNum(e.valor) })),
    proyeccion_gastos: proyeccion.map((e) => ({
      concepto: e.concepto || '',
      valor: toNum(e.valor),
    })),
    parametros: {
      cuenta_bolsillo: toNum(parametros.cuenta_bolsillo),
      meta: toNum(parametros.meta),
      est_prest_serv: 0,
    },
    gastos_fijos: gastosFijos.flatMap((gf) =>
      (gf.meses || []).map((m) => ({
        gasto_fijo_id: gf.gasto_fijo_id,
        anio: m.anio,
        mes: m.mes,
        valor: toNum(m.valor),
        seleccionado: !!m.seleccionado,
      }))
    ),
  });

  const guardar = async (automatico = false) => {
    setMensaje('');
    setError('');
    setGuardando(true);
    try {
      await axios.put(`${API_BASE}/flujo-caja`, construirPayload());
      setMensaje(automatico ? 'Guardado automáticamente.' : 'Flujo de caja guardado.');
    } catch (err) {
      console.error('Error guardando flujo de caja:', err);
      setError(err?.response?.data?.error || 'Error al guardar el flujo de caja.');
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    if (!cargado.current) return undefined;
    if (omitirSiguiente.current) {
      omitirSiguiente.current = false;
      return undefined;
    }
    const timer = setTimeout(() => guardar(true), AUTOSAVE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entradas, proyeccion, parametros, gastosFijos]);

  return (
    <main className={pageClass}>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Presupuesto</p>
          <h2 className="mt-1 text-3xl font-black tracking-normal text-[#061640]">Flujo de caja</h2>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Proyecta cuánto dinero entra, tus gastos fijos y la meta de ahorro.
          </p>
        </div>
        <button
          type="button"
          onClick={() => guardar(false)}
          disabled={guardando}
          className="h-12 rounded-xl bg-teal-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </header>

      {mensaje && (
        <p className="mb-4 rounded-xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </p>
      )}

      <section className={cardClass}>
        <h3 className="mb-4 text-lg font-black text-[#061640]">Indicadores</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {PARAMS.map((p) => (
            <label
              key={p.key}
              className="block rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs font-bold uppercase tracking-wide text-slate-400"
            >
              {p.label}
              <input
                type="number"
                aria-label={p.label}
                className={`${tableInputClass} mt-2 h-12 text-right text-base`}
                value={parametros[p.key] ?? ''}
                onChange={(ev) => setParametros((prev) => ({ ...prev, [p.key]: ev.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CALCULADOS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.key}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-4"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.tone}`}
                >
                  <Icon />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-snug text-slate-500">{c.label}</p>
                  <p
                    data-testid={c.key}
                    className={`mt-1 break-words text-base font-black leading-tight ${
                      indicadores[c.key] < 0 ? 'text-red-600' : 'text-[#12b8a6]'
                    }`}
                  >
                    {formatCurrency(indicadores[c.key], { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <TablaFilas
        titulo="Dinero entra"
        filas={entradas}
        onChange={updateEntrada}
        onAdd={agregarEntrada}
        onRemove={eliminarEntrada}
        ariaPrefix={{ concepto: 'Concepto', valor: 'Valor', eliminar: 'Eliminar fila' }}
        totalLabel="Total dinero entra"
        totalId="total-entra"
      />

      <TablaFilas
        titulo="Proyección gastos"
        filas={proyeccion}
        onChange={updateProyeccion}
        onAdd={agregarProyeccion}
        onRemove={eliminarProyeccion}
        ariaPrefix={{
          concepto: 'Concepto proyección',
          valor: 'Valor proyección',
          eliminar: 'Eliminar proyección',
        }}
        totalLabel="Total proyección gastos"
        totalId="total-proyeccion"
      />

      <section className={cardClass}>
        <h3 className="mb-4 text-lg font-black text-[#061640]">Gastos fijos</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Gasto fijo</th>
                {meses.map((m) => (
                  <th key={`${m.anio}-${m.mes}`} className="px-3 py-2">
                    {m.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gastosFijos.map((gf) => (
                <tr key={gf.gasto_fijo_id}>
                  <td className="px-3 py-2 font-semibold text-[#061640]">{gf.descripcion}</td>
                  {meses.map((mes) => {
                    const celda = (gf.meses || []).find(
                      (x) => x.anio === mes.anio && x.mes === mes.mes
                    );
                    if (!celda) return <td key={`${mes.anio}-${mes.mes}`} />;
                    return (
                      <td key={`${mes.anio}-${mes.mes}`} className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            aria-label={`${gf.descripcion} ${mes.nombre} seleccionado`}
                            className="h-4 w-4 accent-teal-600"
                            checked={!!celda.seleccionado}
                            onChange={(ev) =>
                              updateMes(
                                gf.gasto_fijo_id,
                                mes.anio,
                                mes.mes,
                                'seleccionado',
                                ev.target.checked
                              )
                            }
                          />
                          <input
                            type="number"
                            aria-label={`${gf.descripcion} ${mes.nombre} valor`}
                            className={`${tableInputClass} text-right`}
                            value={celda.valor ?? ''}
                            onChange={(ev) =>
                              updateMes(
                                gf.gasto_fijo_id,
                                mes.anio,
                                mes.mes,
                                'valor',
                                ev.target.value
                              )
                            }
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {gastosFijos.length === 0 && (
                <tr>
                  <td
                    colSpan={meses.length + 1}
                    className="px-3 py-8 text-center font-semibold text-slate-400"
                  >
                    Sin gastos fijos.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-black text-[#061640]">
                <td className="px-3 py-3">Total por mes</td>
                {meses.map((m) => (
                  <td
                    key={`${m.anio}-${m.mes}`}
                    data-testid={`total-mes-${m.mes}`}
                    className="px-3 py-3"
                  >
                    {formatCurrency(totalGastosFijosMes(gastosFijos, m.anio, m.mes))}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-4 text-right text-sm font-bold text-slate-500">
          Total gastos fijos:{' '}
          <span data-testid="total-gf" className="text-lg font-black text-[#061640]">
            {formatCurrency(totalGastos)}
          </span>
        </p>
      </section>
    </main>
  );
}
