import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './utils/api';
import { formatCurrency } from './utils/format';
import {
  calcularIndicadores,
  totalDineroEntra,
  totalGastosFijos,
  totalGastosFijosMes,
} from './utils/flujoCaja';

const pageClass = 'min-h-screen px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8';
const cardClass = 'mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6';
const tableInputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100';

const thClass =
  'border border-slate-900 bg-amber-200 px-3 py-2 text-left text-xs font-black uppercase text-slate-900';
const thBlueClass =
  'border border-slate-900 bg-sky-500 px-3 py-2 text-left text-xs font-black uppercase text-white';
const tdClass = 'border border-slate-900 bg-amber-50 px-2 py-1';
const AUTOSAVE_MS = 800;

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const moneyClass = (v) => (v < 0 ? 'text-red-600' : 'text-[#061640]');

const PARAMS = [
  { key: 'cuenta_bolsillo', label: 'Actual cuenta bolsillo' },
  { key: 'meta', label: 'Meta' },
  { key: 'est_prest_serv', label: 'Est cont prest serv' },
];

const CALCULADOS = [
  { key: 'falta_meta_total', label: 'Falta meta total' },
  { key: 'posible_gran_total', label: 'Posible gran total' },
  { key: 'dif_meta', label: 'Dif meta' },
  { key: 'a_3_meses', label: 'A 3 meses' },
  { key: 'a_4_meses', label: 'A 4 meses' },
  { key: 'bolsa', label: 'Bolsa' },
];

export default function FlujoCaja() {
  const [entradas, setEntradas] = useState([]);
  const [parametros, setParametros] = useState({
    cuenta_bolsillo: 0,
    meta: 0,
    est_prest_serv: 0,
  });
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
  const totalGastos = useMemo(() => totalGastosFijos(gastosFijos), [gastosFijos]);
  const indicadores = useMemo(
    () =>
      calcularIndicadores({
        cuentaBolsillo: parametros.cuenta_bolsillo,
        meta: parametros.meta,
        estPrestServ: parametros.est_prest_serv,
        totalEntra,
        totalGastos,
      }),
    [parametros, totalEntra, totalGastos]
  );

  const updateEntrada = (idx, campo, valor) =>
    setEntradas((prev) => prev.map((e, i) => (i === idx ? { ...e, [campo]: valor } : e)));

  const agregarEntrada = () => setEntradas((prev) => [...prev, { concepto: '', valor: 0 }]);

  const eliminarEntrada = (idx) => setEntradas((prev) => prev.filter((_, i) => i !== idx));

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
    parametros: {
      cuenta_bolsillo: toNum(parametros.cuenta_bolsillo),
      meta: toNum(parametros.meta),
      est_prest_serv: toNum(parametros.est_prest_serv),
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
  }, [entradas, parametros, gastosFijos]);

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
        <h3 className="mb-4 text-lg font-black text-[#061640]">Dinero entra</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr>
                <th className={thClass}>Concepto</th>
                <th className={thClass}>Valor</th>
                <th className={`${thClass} w-24`}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((e, idx) => (
                <tr key={e.id ?? `n-${idx}`}>
                  <td className={tdClass}>
                    <input
                      type="text"
                      aria-label={`Concepto ${idx + 1}`}
                      placeholder="Concepto"
                      className={tableInputClass}
                      value={e.concepto ?? ''}
                      onChange={(ev) => updateEntrada(idx, 'concepto', ev.target.value)}
                    />
                  </td>
                  <td className={tdClass}>
                    <input
                      type="number"
                      aria-label={`Valor ${idx + 1}`}
                      className={`${tableInputClass} text-right`}
                      value={e.valor ?? ''}
                      onChange={(ev) => updateEntrada(idx, 'valor', ev.target.value)}
                    />
                  </td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      aria-label={`Eliminar fila ${idx + 1}`}
                      onClick={() => eliminarEntrada(idx)}
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
            onClick={agregarEntrada}
            className="h-9 rounded-lg bg-blue-50 px-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
          >
            Agregar fila
          </button>
          <p className="text-sm font-bold text-slate-500">
            Total dinero entra:{' '}
            <span
              data-testid="total-entra"
              className={`text-lg font-black ${moneyClass(totalEntra)}`}
            >
              {formatCurrency(totalEntra)}
            </span>
          </p>
        </div>
      </section>

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

      <section className={cardClass}>
        <h3 className="mb-4 text-lg font-black text-[#061640]">Indicadores</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr>
                {PARAMS.map((p) => (
                  <th key={p.key} className={thClass}>
                    {p.label}
                  </th>
                ))}
                {CALCULADOS.map((c) => (
                  <th key={c.key} className={thBlueClass}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {PARAMS.map((p) => (
                  <td key={p.key} className={tdClass}>
                    <input
                      type="number"
                      aria-label={p.label}
                      className={`${tableInputClass} text-right`}
                      value={parametros[p.key] ?? ''}
                      onChange={(ev) =>
                        setParametros((prev) => ({ ...prev, [p.key]: ev.target.value }))
                      }
                    />
                  </td>
                ))}
                {CALCULADOS.map((c) => (
                  <td
                    key={c.key}
                    data-testid={c.key}
                    className={`border border-slate-900 bg-sky-50 px-3 py-2 text-right text-base font-black ${moneyClass(indicadores[c.key])}`}
                  >
                    {formatCurrency(indicadores[c.key])}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
