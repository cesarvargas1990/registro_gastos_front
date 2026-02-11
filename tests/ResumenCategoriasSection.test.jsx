import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
