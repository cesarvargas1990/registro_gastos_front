import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalesCategoriaSection from '../src/components/dashboard/TotalesCategoriaSection.jsx';

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
    expect(screen.getByText(/\$\s*1\.500,00/)).toBeInTheDocument();
    expect(screen.getByText(/\$\s*800,00/)).toBeInTheDocument();
  });
});
