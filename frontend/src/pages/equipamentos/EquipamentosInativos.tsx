import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../dashboard/Dashboard.css';
import '../Css/Pesquisa.css';

interface Equipamento {
  id_equipamento: number;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  estado: string;
  status: string;
}

const EquipamentosInativos: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const carregarEquipamentos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/equipamentos/inativos");
      setEquipamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar equipamentos inativos:", error);
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const ativarEquipamento = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/equipamentos/ativar/${id}`);
      setEquipamentos(prev => prev.filter(eq => eq.id_equipamento !== id));
    } catch (error) {
      console.error("Erro ao reativar equipamento:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}>
            <img src="/icon-clientes.png" alt="Ícone Clientes" /> <span>CLIENTES</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}>
            <img src="/icon-equipamentos.png" alt="Ícone Equipamentos" /> <span>EQUIPAMENTOS</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}>
            <img src="/icon-os.png" alt="Ícone OS" /> <span>ORDEM DE SERVIÇO</span>
          </button>
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}>
                <img src="/icon-tecnicos.png" alt="Ícone Técnicos" /> <span>TÉCNICOS</span>
              </button>
              <button className="menu-btn" onClick={() => navigate("/rfid")}>
                <img src="/icon-rfid.png" alt="Ícone RFID" /> <span>RFID</span>
              </button>
              <button className="menu-btn" onClick={() => navigate("/usuarios")}>
                <img src="/icon-usuarios.png" alt="Ícone Usuários" />
                <span>USUÁRIOS</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">EQUIPAMENTOS INATIVOS</h1>
        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes">
              <table>
                <thead>
                  <tr>
                    <th>TIPO</th>
                    <th>MARCA</th>
                    <th>MODELO</th>
                    <th>Nº SÉRIE</th>
                    <th>ESTADO</th>
                    <th>AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.map((eq) => (
                    <tr key={eq.id_equipamento}>
                      <td>{eq.tipo}</td>
                      <td>{eq.marca}</td>
                      <td>{eq.modelo}</td>
                      <td>{eq.numero_serie}</td>
                      <td>{eq.estado}</td>
                      <td>
                        <button className="btn cinza" onClick={() => ativarEquipamento(eq.id_equipamento)}>
                          ATIVAR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate("/equipamentos")}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EquipamentosInativos;
