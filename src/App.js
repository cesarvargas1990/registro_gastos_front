import React, { useState } from 'react';
import TablaReportes from './TablaReportes.jsx';
import MesesTable from './MesesTable.jsx';
import GastosFijosTable from './GastosFijosTable.jsx';
import Dashboard from './Dashboard.jsx';
import GastosForm from './GastosForm.jsx';
import Login from './Login.jsx';
import {
  FaCalendarAlt,
  FaHome,
  FaListAlt,
  FaPiggyBank,
  FaPowerOff,
  FaReceipt,
  FaWallet,
} from 'react-icons/fa';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vista, setVista] = useState('dashboard');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('authToken');
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: FaHome },
    { id: 'registrar', label: 'Movimientos', icon: FaReceipt },
    { id: 'listado', label: 'Lista Movimientos', icon: FaListAlt },
    { id: 'meses', label: 'Meses', icon: FaCalendarAlt },
    { id: 'gastos-fijos', label: 'Gastos Fijos', icon: FaWallet },
  ];

  const renderNavButton = ({ id, label, icon: Icon }, onSelect) => {
    const active = vista === id;
    return (
      <button
        key={id}
        onClick={() => onSelect(id)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
          active
            ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-950/30'
            : 'text-slate-200/90 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon className="text-base" />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-slate-950">
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:hidden">
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center">
          <button
            className="text-left text-2xl text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-center text-base font-bold">Finanzas</h1>
          <span aria-hidden="true" />
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-60 bg-[#162948] text-white shadow-2xl md:block">
        <div className="flex h-full flex-col bg-[radial-gradient(circle_at_0_0,rgba(116,90,255,0.22),transparent_35%),linear-gradient(180deg,#172a4a_0%,#10213b_100%)] px-5 py-8">
          <div className="mb-9 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-indigo-500 shadow-lg shadow-cyan-950/30">
              <FaPiggyBank className="text-sm" />
            </span>
            <h2 className="text-lg font-bold">Finanzas</h2>
          </div>

          <nav className="flex flex-col gap-3">
            {navItems.map((item) => renderNavButton(item, setVista))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200/90 transition hover:bg-white/10 hover:text-white"
          >
            <FaPowerOff />
            Salir
          </button>
        </div>
      </aside>

      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-[#162948] text-white shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold">Finanzas</h2>
          <button className="text-lg text-white" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-3 p-5">
          {navItems.map((item) =>
            renderNavButton(item, (id) => {
              setVista(id);
              setSidebarOpen(false);
            })
          )}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200/90 transition hover:bg-white/10 hover:text-white"
          >
            <FaPowerOff />
            Salir
          </button>
        </nav>
      </div>

      {vista === 'dashboard' && <Dashboard />}

      {vista === 'registrar' && <GastosForm />}

      {vista === 'listado' && <TablaReportes />}

      {vista === 'meses' && <MesesTable />}

      {vista === 'gastos-fijos' && <GastosFijosTable />}
    </div>
  );
}

export default App;
