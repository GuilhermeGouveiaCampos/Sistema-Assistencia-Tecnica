// src/pages/dashboard/Dashboard.tsx

import React from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo Eletrotek" />
        </div>

        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}>
            <img src="/icon-clientes.png" alt="Ícone Clientes" />
            <span>CLIENTES</span>
          </button>

          <button className="menu-btn" onClick={() => navigate("/equipamentos")}>
            <img src="/icon-equipamentos.png" alt="Ícone Equipamentos" />
            <span>EQUIPAMENTOS</span>
          </button>

          <button className="menu-btn" onClick={() => navigate("/ordemservico")}>
            <img src="/icon-os.png" alt="Ícone Ordem de Serviço" />
            <span>ORDEM DE SERVIÇO</span>
          </button>

          {/* Itens extras só para admin (id = 1) */}
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}>
                <img src="/icon-tecnicos.png" alt="Ícone Técnicos" />
                <span>TÉCNICOS</span>
              </button>

              <button className="menu-btn" onClick={() => navigate("/rfid")}>
                <img src="/icon-rfid.png" alt="Ícone RFID" />
                <span>RFID</span>
              </button>

              <button className="menu-btn" onClick={() => navigate("/usuarios")}>
                <img src="/icon-usuarios.png" alt="Ícone Usuários" />
                <span>USUÁRIOS</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <div className="logo-central">
          <img src="/logo.png" alt="Logotipo Eletrotek Central" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
