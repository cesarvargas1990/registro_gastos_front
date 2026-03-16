import React from 'react';
import { render, screen } from '@testing-library/react';
import IndicadoresSection from '../src/components/dashboard/IndicadoresSection.jsx';

describe('IndicadoresSection', () => {
  it('renderiza los indicadores y los iconos', () => {
    const indicadores = [{ ingreso_neto_estimado: 1000, meta_ahorro_estimada: 500 }];
    const iconMap = {
      ingreso_neto_estimado: <span data-testid="icon-ingreso" />,
      meta_ahorro_estimada: <span data-testid="icon-ahorro" />,
    };
    const labelMap = {
      ingreso_neto_estimado: 'Ingresos Estimados',
      meta_ahorro_estimada: 'Meta de Ahorro',
    };
    render(<IndicadoresSection indicadores={indicadores} iconMap={iconMap} labelMap={labelMap} />);
    expect(screen.getByText(/indicadores financieros/i)).toBeInTheDocument();
    expect(screen.getByText(/ingresos estimados/i)).toBeInTheDocument();
    expect(screen.getByText(/meta de ahorro/i)).toBeInTheDocument();
    expect(screen.getByText(/\$\s*1\.000/)).toBeInTheDocument();
    expect(screen.getByText(/\$\s*500/)).toBeInTheDocument();
  });

  it('usa fallback de icono y label cuando no existen en los mapas', () => {
    render(<IndicadoresSection indicadores={[{ clave_desconocida: 250 }]} iconMap={{}} labelMap={{}} />);

    expect(screen.getByText('clave_desconocida')).toBeInTheDocument();
    expect(screen.getByText(/\$\s*250/)).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('renderiza solo el titulo cuando no hay indicadores', () => {
    render(<IndicadoresSection indicadores={[]} iconMap={{}} labelMap={{}} />);

    expect(screen.getByText(/indicadores financieros/i)).toBeInTheDocument();
    expect(screen.queryByText('clave_desconocida')).not.toBeInTheDocument();
  });
});
