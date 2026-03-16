import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalesCategoriaSection from '../src/components/dashboard/TotalesCategoriaSection.jsx';
import { formatCurrency } from '../src/utils/format.js';

describe('TotalesCategoriaSection', () => {
  it('renderiza totales por categoria', () => {
    const totalesCategoria = [
      { categoria_id: 1, categoria: 'Alimentos', total_categoria: 1500 },
      { categoria_id: 2, categoria: 'Transporte', total_categoria: 800 },
    ];
    render(<TotalesCategoriaSection totalesCategoria={totalesCategoria} />);
    expect(screen.getByText(/totales por categoria/i)).toBeInTheDocument();
    expect(screen.getByText('Alimentos')).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === formatCurrency(1500))
    ).toBeInTheDocument();
    expect(screen.getByText((_, node) => node?.textContent === formatCurrency(800))).toBeInTheDocument();
  });
});
