const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const totalFilas = (filas = []) => filas.reduce((acc, e) => acc + num(e?.valor), 0);

export const totalDineroEntra = totalFilas;

export const totalProyeccionGastos = totalFilas;

export const totalGastosFijosMes = (gastosFijos = [], anio, mes) =>
  gastosFijos.reduce(
    (acc, gf) =>
      acc +
      (gf.meses || []).reduce(
        (a, m) => (m.anio === anio && m.mes === mes && m.seleccionado ? a + num(m.valor) : a),
        0
      ),
    0
  );

export const totalGastosFijos = (gastosFijos = []) =>
  gastosFijos.reduce(
    (acc, gf) =>
      acc + (gf.meses || []).reduce((a, m) => (m.seleccionado ? a + num(m.valor) : a), 0),
    0
  );

export const calcularIndicadores = ({
  cuentaBolsillo,
  meta,
  estPrestServ,
  totalEntra,
  totalGastos,
  totalProyeccion = 0,
}) => {
  const cuenta = num(cuentaBolsillo);
  const m = num(meta);
  const faltaMetaTotal = m - cuenta;
  const posibleGranTotal =
    cuenta + num(totalEntra) - num(totalGastos) - num(totalProyeccion) + num(estPrestServ);
  const difMeta = posibleGranTotal - m;
  return {
    falta_meta_total: faltaMetaTotal,
    posible_gran_total: posibleGranTotal,
    dif_meta: difMeta,
    a_3_meses: faltaMetaTotal / 3,
    a_4_meses: faltaMetaTotal / 4,
    bolsa: difMeta,
  };
};
