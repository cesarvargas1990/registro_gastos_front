import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartsSection from '../src/components/dashboard/ChartsSection.jsx';
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Bar chart mock</div>,
  Line: () => <div>Line chart mock</div>,
}));

describe('ChartsSection', () => {
  it('renderiza los títulos y los mocks de charts', () => {
    const resumenMensual = [
      { Mes: 'Enero', Total_Mensual_Con_Adicionales: 1000 },
      { Mes: 'Febrero', Total_Mensual_Con_Adicionales: 2000 },
    ];
    const resumenGastos = [
      {
        mes: 'Enero',
        meta_ahorro: 500,
        disponible_estimado_cubriendo_gastos: 300,
        disponible_estimado_sin_cubrir_gastos: 200,
      },
      {
        mes: 'Febrero',
        meta_ahorro: 600,
        disponible_estimado_cubriendo_gastos: 400,
        disponible_estimado_sin_cubrir_gastos: 300,
      },
    ];
    render(<ChartsSection resumenMensual={resumenMensual} resumenGastos={resumenGastos} />);
    expect(screen.getByText(/total por mes/i)).toBeInTheDocument();
    expect(screen.getByText(/ahorros y estimaciones/i)).toBeInTheDocument();
    expect(screen.getByText(/bar chart mock/i)).toBeInTheDocument();
    expect(screen.getByText(/line chart mock/i)).toBeInTheDocument();
  });
});
