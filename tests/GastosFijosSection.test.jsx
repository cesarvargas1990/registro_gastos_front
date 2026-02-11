import React from 'react';
import { render, screen } from '@testing-library/react';
import GastosFijosSection from '../src/components/dashboard/GastosFijosSection.jsx';

describe('GastosFijosSection', () => {
  it('renderiza resumen de gastos fijos y totales por mes', () => {
    const resumenTabla = [
      { Descripción: 'Renta', Valor: 1000, Enero: true, Febrero: false },
      { Descripción: 'Luz', Valor: 200, Enero: true, Febrero: true },
    ];
    const resumenMensual = [
      { Mes: 'Enero', Total_Mensual: 1200, Pendiente_gastoFijo: 0 },
      { Mes: 'Febrero', Total_Mensual: 200, Pendiente_gastoFijo: 1000 },
    ];
    const meses = ['Enero', 'Febrero'];
    render(
      <GastosFijosSection
        resumenTabla={resumenTabla}
        resumenMensual={resumenMensual}
        meses={meses}
        onToggleGastoFijo={() => {}}
      />
    );
    expect(screen.getByText(/resumen de gastos fijos/i)).toBeInTheDocument();
    expect(screen.getByText('Renta')).toBeInTheDocument();
    expect(screen.getByText('Luz')).toBeInTheDocument();
    expect(screen.getAllByText(/\$\s*1\.000,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$\s*200,00/).length).toBeGreaterThan(0);
    expect(screen.getByText(/total por mes/i)).toBeInTheDocument();
    expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
  });
});
