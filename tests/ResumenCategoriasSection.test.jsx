import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ResumenCategoriasSection from '../src/components/dashboard/ResumenCategoriasSection.jsx';

describe('ResumenCategoriasSection', () => {
  it('renderiza resumen mensual por categoría', () => {
    const columnas = ['Mes', 'Alimentos', 'Transporte'];
    const datos = [
      { Mes: 'Enero', Alimentos: 1000, Transporte: 500 },
      { Mes: 'Febrero', Alimentos: 1200, Transporte: 600 },
    ];
    render(<ResumenCategoriasSection columnas={columnas} datos={datos} />);
    expect(screen.getByText(/resumen mensual por categoría/i)).toBeInTheDocument();
    expect(screen.getByText('Enero')).toBeInTheDocument();
    expect(screen.getByText('Febrero')).toBeInTheDocument();
    expect(screen.getByText(/\$\s*1\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/\$\s*500,00/)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it('resalta el mes actual y deja vacio el total de columnas no numericas', () => {
    const mesActual = new Intl.DateTimeFormat('es-CO', { month: 'long' })
      .format(new Date())
      .replace(/^./, (char) => char.toUpperCase());
    const otroMes = mesActual === 'Enero' ? 'Febrero' : 'Enero';
    const columnas = ['Mes', 'Nota', 'Alimentos'];
    const datos = [
      { Mes: mesActual, Nota: 'ok', Alimentos: 1000 },
      { Mes: otroMes, Nota: 'pendiente', Alimentos: 500 },
    ];

    render(<ResumenCategoriasSection columnas={columnas} datos={datos} />);

    const filaMesActual = screen.getByText(mesActual).closest('tr');
    expect(filaMesActual).toHaveClass('bg-gray-700/60');

    const filaTotal = screen.getByText('Total').closest('tr');
    const celdas = within(filaTotal).getAllByRole('cell');
    expect(celdas[1]).toBeEmptyDOMElement();
    expect(celdas[2].textContent).toMatch(/1\.500,00/);
  });
});
