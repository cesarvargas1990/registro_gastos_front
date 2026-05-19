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
    <main className="min-h-screen space-y-5 px-4 pb-8 pt-20 text-slate-950 md:ml-60 md:px-8 md:pt-8">
      <header>
        <div>
          <h1 className="text-3xl font-black tracking-normal text-[#061640]">Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-slate-400">Resumen general de tus finanzas</p>
        </div>
      </header>

      <ChartsSection resumenMensual={resumenMensual} resumenGastos={resumenGastos} />

      <GastosFijosSection
        resumenTabla={resumenTabla}
        resumenMensual={resumenMensual}
        meses={MESES}
        onToggleGastoFijo={handleGastoFijoToggle}
      />

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
