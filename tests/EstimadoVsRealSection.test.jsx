import React from 'react';
import { render, screen, within } from '@testing-library/react';
import EstimadoVsRealSection from '../src/components/dashboard/EstimadoVsRealSection.jsx';

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

describe('EstimadoVsRealSection', () => {
  it('renderiza filas, resalta el mes actual y marca en verde solo el ultimo disponible positivo', () => {
    const mesActual = meses[new Date().getMonth()];
    const resumenRealVsEstimado = [
      {
        mes: mesActual,
        ingreso_neto_est: 1000,
        ingreso_real: 900,
        dif_ingreso: -100,
        meta_ahorro_est: 300,
        ahorro_real: 200,
        dif_ahorro: -100,
        gastos_fijos_est: 600,
        gastos_fijos_real: 650,
        dif_gastos_fijo: 50,
        gastos_adicionales: 120,
        ingresos_extra: 0,
        disponible_estimado: 80,
        disponible_cuenta: 40,
        disp_desp_cump_meta: 111,
      },
      {
        mes: 'Abril',
        ingreso_neto_est: 0,
        ingreso_real: undefined,
        dif_ingreso: 0,
        meta_ahorro_est: 0,
        ahorro_real: 0,
        dif_ahorro: 0,
        gastos_fijos_est: 0,
        gastos_fijos_real: 0,
        dif_gastos_fijo: 0,
        gastos_adicionales: 0,
        ingresos_extra: 0,
        disponible_estimado: 0,
        disponible_cuenta: 0,
        disp_desp_cump_meta: -22,
      },
      {
        mes: 'Marzo',
        ingreso_neto_est: 5000,
        ingreso_real: 5100,
        dif_ingreso: 100,
        meta_ahorro_est: 1000,
        ahorro_real: 1100,
        dif_ahorro: 100,
        gastos_fijos_est: 2500,
        gastos_fijos_real: 2400,
        dif_gastos_fijo: -100,
        gastos_adicionales: 500,
        ingresos_extra: 200,
        disponible_estimado: 1200,
        disponible_cuenta: 1400,
        disp_desp_cump_meta: 333,
      },
    ];

    render(<EstimadoVsRealSection resumenRealVsEstimado={resumenRealVsEstimado} meses={meses} />);

    expect(screen.getByText(/estimado vs real/i)).toBeInTheDocument();

    const filaMesActual = screen.getByText(mesActual).closest('tr');
    expect(filaMesActual).toHaveClass('bg-gray-700/60');

    const filaMesActualCeldas = within(filaMesActual).getAllByRole('cell');
    expect(filaMesActualCeldas[14]).not.toHaveClass('text-green-400');

    const filaMarzo = screen.getByText('Marzo').closest('tr');
    const filaMarzoCeldas = within(filaMarzo).getAllByRole('cell');
    expect(filaMarzoCeldas[14]).toHaveClass('text-green-400');

    const filaAbril = screen.getByText('Abril').closest('tr');
    const filaAbrilCeldas = within(filaAbril).getAllByRole('cell');
    expect(filaAbrilCeldas[2].textContent).toMatch(/0,00/);
  });

  it('calcula y muestra los totales en el pie de tabla', () => {
    const resumenRealVsEstimado = [
      {
        mes: 'Enero',
        ingreso_neto_est: 1000,
        ingreso_real: 2000,
        dif_ingreso: 1000,
        meta_ahorro_est: 100,
        ahorro_real: 120,
        dif_ahorro: 20,
        gastos_fijos_est: 700,
        gastos_fijos_real: 680,
        dif_gastos_fijo: -20,
        gastos_adicionales: 80,
        ingresos_extra: 30,
        disponible_estimado: 250,
        disponible_cuenta: 260,
        disp_desp_cump_meta: 0,
      },
      {
        mes: 'Febrero',
        ingreso_neto_est: 3000,
        ingreso_real: 2500,
        dif_ingreso: -500,
        meta_ahorro_est: 200,
        ahorro_real: 150,
        dif_ahorro: -50,
        gastos_fijos_est: 900,
        gastos_fijos_real: 1000,
        dif_gastos_fijo: 100,
        gastos_adicionales: 120,
        ingresos_extra: 60,
        disponible_estimado: 400,
        disponible_cuenta: 350,
        disp_desp_cump_meta: -10,
      },
    ];

    render(<EstimadoVsRealSection resumenRealVsEstimado={resumenRealVsEstimado} meses={meses} />);

    const filaTotales = screen.getByText('Totales').closest('tr');
    const celdasTotales = within(filaTotales).getAllByRole('cell');

    expect(celdasTotales[1].textContent).toMatch(/4\.000,00/);
    expect(celdasTotales[2].textContent).toMatch(/4\.500,00/);
    expect(celdasTotales[13].textContent).toMatch(/610,00/);
  });
});
