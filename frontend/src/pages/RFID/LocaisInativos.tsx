// src/pages/rfid/LocaisInativos.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../dashboard/Dashboard.css';
import '../Css/Pesquisa.css';

interface Local {
  id_scanner: string;
  local_instalado: string;
  status: string;
  motivo_inativacao: string;
}


const LocaisInativos: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const [locaisInativos, setLocaisInativos] = useState<Local[]>([]);

  const buscarInativos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/locais/inativos');
      setLocaisInativos(res.data);
    } catch (error) {
      console.error('Erro ao buscar locais inativos:', error);
    }
  };

  const ativarLocal = async (id: string) => {
    try {
      await axios.put(`http://localhost:3001/api/locais/ativar/${id}`);
      buscarInativos(); // atualiza a lista
    } catch (error) {
      console.error('Erro ao ativar local:', error);
    }
  };

  useEffect(() => {
    buscarInativos();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="Logo" /></div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}><img src="/icon-clientes.png" alt="" /><span>CLIENTES</span></button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}><img src="/icon-equipamentos.png" alt="" /><span>EQUIPAMENTOS</span></button>
          <button className="menu-btn" onClick={() => navigate("/ordens")}><img src="/icon-os.png" alt="" /><span>ORDEM DE SERVIÇO</span></button>
          <button className="menu-btn" onClick={() => navigate("/tecnicos")}><img src="/icon-tecnicos.png" alt="" /><span>TÉCNICOS</span></button>
          <button className="menu-btn" onClick={() => navigate("/rfid")}><img src="/icon-rfid.png" alt="" /><span>RFID</span></button>
          <button className="menu-btn" onClick={() => navigate("/usuarios")}>
                <img src="/icon-usuarios.png" alt="Ícone Usuários" />
                <span>USUÁRIOS</span>
              </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">LOCAIS INATIVOS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes">
              <table>
               <thead>
  <tr>
    <th>ID SCANNER</th>
    <th>LOCAL INSTALADO</th>
    <th>MOTIVO</th> 
    <th>AÇÃO</th>
  </tr>
</thead>
<tbody>
  {locaisInativos.map((loc) => (
    <tr key={loc.id_scanner}>
      <td>{loc.id_scanner}</td>
      <td>{loc.local_instalado}</td>
      <td>{loc.motivo_inativacao}</td>
      <td>
        <button
          className="btn verde"
          onClick={() => ativarLocal(loc.id_scanner)}
        >
          ATIVAR
        </button>
      </td>
    </tr>
  ))}
</tbody>


              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/rfid')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LocaisInativos;
