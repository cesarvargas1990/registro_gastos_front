import React, { useState } from 'react';
import TablaReportes from './TablaReportes.jsx';
import MesesTable from './MesesTable.jsx';
import GastosFijosTable from './GastosFijosTable.jsx';
import Dashboard from './Dashboard.jsx';
import GastosForm from './GastosForm.jsx';
import Login from './Login.jsx';

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
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gray-800 px-4 py-3 shadow-md md:ml-64">
        <div className="flex items-center justify-between">
          <button className="text-white text-2xl md:hidden" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1 className="text-xl font-bold">DASHBOARD</h1>
        </div>
      </header>

      {/* Sidebar fijo desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-md z-40 pt-12">
        <div className="px-4 pb-2">
          <h2 className="text-lg font-bold text-white mb-4">💸 Finanzas</h2>
          <nav className="flex flex-col gap-4 text-white">
            <button onClick={() => setVista('dashboard')} className="text-left hover:text-teal-400">
              Inicio
            </button>
            <button onClick={() => setVista('registrar')} className="text-left hover:text-teal-400">
              Movimientos
            </button>
            <button onClick={() => setVista('listado')} className="text-left hover:text-teal-400">
              Lista Movimientos
            </button>
            <button onClick={() => setVista('meses')} className="text-left hover:text-teal-400">
              Meses
            </button>
            <button
              onClick={() => setVista('gastos-fijos')}
              className="text-left hover:text-teal-400"
            >
              Gastos Fijos
            </button>
            <button onClick={handleLogout} className="hover:text-teal-400 w-full text-left">
              Salir
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-md z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-bold">💸 Finanzas</h2>
          <button className="text-white text-lg" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <button
            onClick={() => {
              setVista('dashboard');
              setSidebarOpen(false);
            }}
            className="text-left hover:text-teal-400"
          >
            Inicio
          </button>
          <button
            onClick={() => {
              setVista('registrar');
              setSidebarOpen(false);
            }}
            className="text-left hover:text-teal-400"
          >
            Registrar Gasto
          </button>
          <button
            onClick={() => {
              setVista('listado');
              setSidebarOpen(false);
            }}
            className="text-left hover:text-teal-400"
          >
            Reportes
          </button>
          <button
            onClick={() => {
              setVista('meses');
              setSidebarOpen(false);
            }}
            className="text-left hover:text-teal-400"
          >
            Meses
          </button>
          <button
            onClick={() => {
              setVista('gastos-fijos');
              setSidebarOpen(false);
            }}
            className="text-left hover:text-teal-400"
          >
            Gastos Fijos
          </button>
          <button onClick={handleLogout} className="hover:text-teal-400 w-full text-left">
            Salir
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      {vista === 'dashboard' && <Dashboard />}

      {vista === 'registrar' && <GastosForm />}

      {vista === 'listado' && <TablaReportes />}

      {vista === 'meses' && <MesesTable />}

      {vista === 'gastos-fijos' && <GastosFijosTable />}
    </div>
  );
}

export default App;
