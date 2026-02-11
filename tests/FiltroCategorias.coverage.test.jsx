import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FiltroCategorias from '../src/FiltroCategorias.jsx';

jest.mock('../src/utils/api', () => ({
  getJson: jest.fn(() =>
    Promise.resolve([
      { id: 1, nombre: 'Alimentos' },
      { id: 2, nombre: 'Transporte' },
    ])
  ),
}));

describe('FiltroCategorias coverage', () => {
  it('renders select and options', async () => {
    render(<FiltroCategorias value="" onChange={() => {}} />);
    expect(await screen.findByText('Selecciona una categoría')).toBeInTheDocument();
    expect(await screen.findByText('Alimentos')).toBeInTheDocument();
    expect(await screen.findByText('Transporte')).toBeInTheDocument();
  });

  it('calls onChange when option selected', async () => {
    const handleChange = jest.fn();
    render(<FiltroCategorias value="" onChange={handleChange} />);
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('handles API error', async () => {
    jest.spyOn(require('../src/utils/api'), 'getJson').mockRejectedValueOnce(new Error('fail'));
    render(<FiltroCategorias value="" onChange={() => {}} />);
    await waitFor(() => expect(screen.getByText('Selecciona una categoría')).toBeInTheDocument());
  });
});
