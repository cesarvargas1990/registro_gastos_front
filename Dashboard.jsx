import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartsSection from './components/dashboard/ChartsSection';
import GastosFijosSection from './components/dashboard/GastosFijosSection';
import IndicadoresSection from './components/dashboard/IndicadoresSection';
import EstimadoVsRealSection from './components/dashboard/EstimadoVsRealSection';
import ResumenCategoriasSection from './components/dashboard/ResumenCategoriasSection';
import TotalesCategoriaSection from './components/dashboard/TotalesCategoriaSection';
import useDashboardData from './hooks/useDashboardData';
import { iconMap, labelMap } from './utils/dashboardMaps';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const {
    MESES,
    resumenMensual,
    resumenGastos,
    resumenTabla,
    indicadoresDerivados,
    resumenRealVsEstimado,
    totalesCategoria,
    datos,
    columnas,
    handleGastoFijoToggle,
  } = useDashboardData();

  return (
    <main className="pt-20 md:ml-64 p-6 min-h-screen text-white space-y-10">
      {/* Gráficos */}
      <ChartsSection resumenMensual={resumenMensual} resumenGastos={resumenGastos} />

      {/* Tabla Resumen Gastos */}
      <GastosFijosSection
        resumenTabla={resumenTabla}
        resumenMensual={resumenMensual}
        meses={MESES}
        onToggleGastoFijo={handleGastoFijoToggle}
      />

      {/* Indicadores al final */}
      <IndicadoresSection
        indicadores={indicadoresDerivados}
        iconMap={iconMap}
        labelMap={labelMap}
      />

      <EstimadoVsRealSection resumenRealVsEstimado={resumenRealVsEstimado} meses={MESES} />

      <ResumenCategoriasSection columnas={columnas} datos={datos} />

      <TotalesCategoriaSection totalesCategoria={totalesCategoria} />
    </main>
  );
}
