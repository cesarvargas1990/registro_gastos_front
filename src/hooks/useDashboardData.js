import { useCallback, useEffect, useMemo, useState } from 'react';
import { getJson, postJson } from '../utils/api.js';
import { MESES } from '../utils/meses.js';

const ordenarResumenCategorias = (data) => {
  if (!data.length) {
    return { datosOrdenados: [], columnasFinal: [] };
  }

  const datosOrdenados = [...data].sort((a, b) => MESES.indexOf(a.Mes) - MESES.indexOf(b.Mes));
  const columnasDinamicas = Object.keys(data[0]);
  const columnasFinal = ['Mes', ...columnasDinamicas.filter((c) => c !== 'Mes')];

  return { datosOrdenados, columnasFinal };
};

export default function useDashboardData() {
  const [resumenMensual, setResumenMensual] = useState([]);
  const [resumenGastos, setResumenGastos] = useState([]);
  const [resumenTabla, setResumenTabla] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [resumenRealVsEstimado, setResumenRealVsEstimado] = useState([]);
  const [totalesCategoria, setTotalesCategoria] = useState([]);
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const handleResumenCategoriasData = useCallback((data) => {
    const { datosOrdenados, columnasFinal } = ordenarResumenCategorias(data);
    if (datosOrdenados.length) {
      setDatos(datosOrdenados);
      setColumnas(columnasFinal);
    }
  }, []);

  const fetchDashboardData = useCallback(() => {
    getJson('/resumen-mensual').then(setResumenMensual);
    getJson('/resumen-gastos').then(setResumenGastos);
    getJson('/resumen-gastos-mensual').then(setResumenTabla);
    getJson('/dashboard-dinamico').then(setIndicadores);
    getJson('/resumen_estimado_vs_real').then(setResumenRealVsEstimado);

    getJson('/totales-por-categoria')
      .then(setTotalesCategoria)
      .catch((err) => {
        console.error('Error al obtener totales por categoría', err);
      });

    getJson('/resumen-categorias-mensual')
      .then(handleResumenCategoriasData)
      .catch((err) => console.error('Error al cargar datos:', err));
  }, [handleResumenCategoriasData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const indicadoresDerivados = useMemo(() => {
    return indicadores.length
      ? [
          {
            actual_menos_ahorro_real:
              Number(indicadores[0].actual_en_cuenta_ahorros || 0) -
              Number(indicadores[0].ahorro_real || 0),
            ...indicadores[0],
          },
        ]
      : [];
  }, [indicadores]);

  const handleGastoFijoToggle = useCallback(
    (item, mes) => {
      if (item[mes] === undefined || item[mes] === null) {
        const data = {
          descripcion: item.Descripción,
          valor: item.Valor,
          gasto_fijo_id: item.id,
          fecha: `${new Date().getFullYear()}-${MESES.indexOf(mes) + 1}-01`,
          categoria_id: item.categoria_id,
        };

        postJson('/movimientos', data)
          .then(() => {
            fetchDashboardData();
          })
          .catch(() => {
            alert('Error al registrar el movimiento');
          });
      } else {
        alert('Ya fue registrado este gasto');
      }
    },
    [fetchDashboardData]
  );

  return {
    MESES,
    resumenMensual,
    resumenGastos,
    resumenTabla,
    indicadoresDerivados,
    resumenRealVsEstimado,
    totalesCategoria,
    datos,
    columnas,
    fetchDashboardData,
    handleGastoFijoToggle,
  };
}
