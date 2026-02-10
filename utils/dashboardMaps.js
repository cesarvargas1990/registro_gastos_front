import React from 'react';
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaWallet,
  FaBalanceScale,
  FaChartLine,
  FaRegCalendarCheck,
} from 'react-icons/fa';

export const iconMap = {
  ingreso_neto_estimado: <FaMoneyBillWave className="text-teal-400" />,
  meta_ahorro_estimada: <FaPiggyBank className="text-teal-400" />,
  gastos_fijos_estimados: <FaWallet className="text-teal-400" />,
  actual_en_cuenta_ahorros: <FaBalanceScale className="text-teal-400" />,
  actual_menos_ahorro_real: <FaBalanceScale className="text-teal-400" />,
  meta_ahorro_hasta_hoy: <FaRegCalendarCheck className="text-teal-400" />,
  ahorro_real: <FaPiggyBank className="text-teal-400" />,
  faltante_meta_actual: <FaBalanceScale className="text-teal-400" />,
  faltante_meta: <FaChartLine className="text-teal-400" />,
};

export const labelMap = {
  ingreso_neto_estimado: 'Ingresos Estimados Año',
  meta_ahorro_estimada: 'Meta de Ahorro Año',
  ahorro_real: 'Bolsillo Ahorro',
  faltante_meta_actual: 'Faltante de Meta Actual',
  gastos_fijos_estimados: 'Gastos Fijos Estimados Año',
  actual_en_cuenta_ahorros: 'Actual en cuenta ahorros',
  meta_ahorro_hasta_hoy: 'Meta Ahorro Hasta Mes Actual',
  faltante_meta: 'Faltante de Meta actual',
  faltante_meta_anio: 'Faltante de Meta Año',
  gastos_fijos_estimados_anio: 'Gastos Fijos Estimados Año',
  ingresos_estimados_anio: 'Ingresos Estimados Año',
  meta_ahorro_anio: 'Meta de Ahorro Año',
  meta_ahorro_hasta_mes_actual: 'Meta Ahorro Hasta Mes Actual',
  actual_menos_ahorro_real: 'Actual en cuenta ahorros - Bolsillo Ahorro',
};
