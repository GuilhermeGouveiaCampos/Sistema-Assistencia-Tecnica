import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';

interface Ordem {
  id_ordem: number;
  tipo: string;
  modelo: string;
  numero_serie: string;
  motivo_inativacao: string;
}

const OrdensInativas: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");

  const [ordensInativas, setOrdensInativas] = useState<Ordem[]>([]);
  const [ordemSelecionada, setOrdemSelecionada] = useState<Ordem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const carregarOrdens = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/ordemservico/inativas");
      setOrdensInativas(response.data);
    } catch (error) {
      console.error("Erro ao carregar ordens inativas:", error);
    }
  };

  const ativarOrdem = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/ordemservico/ativar/${id}`);
      setShowModal(false);
      carregarOrdens();
    } catch (error) {
      console.error("Erro ao ativar ordem:", error);
    }
  };

  const confirmarAtivacao = (ordem: Ordem) => {
    setOrdemSelecionada(ordem);
    setShowModal(true);
  };

  const cancelar = () => {
    setShowModal(false);
    setOrdemSelecionada(null);
  };

  useEffect(() => {
    carregarOrdens();
  }, []);

  return (
    <div className="dashboard-container">
      {showModal && ordemSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <strong>CONFIRMAR ✅</strong>
              <button className="close-btn" onClick={cancelar}>X</button>
            </div>
            <div className="modal-body">
              <p>Deseja reativar a ordem do equipamento <strong>{ordemSelecionada.tipo}</strong> - <strong>{ordemSelecionada.modelo}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button className="btn azul" onClick={() => ativarOrdem(ordemSelecionada.id_ordem)}>CONFIRMAR</button>
              <button className="btn preto" onClick={cancelar}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
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
            <img src="/icon-os.png" alt="Ícone OS" />
            <span>ORDEM DE SERVIÇO</span>
          </button>
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

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">ORDENS INATIVAS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes inativos">
              <table>
                <thead>
                  <tr>
                    <th>TIPO</th>
                    <th>MODELO</th>
                    <th>SÉRIE</th>
                    <th>MOTIVO</th>
                    <th>AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {ordensInativas.map(ord => (
                    <tr key={ord.id_ordem}>
                      <td>{ord.tipo}</td>
                      <td>{ord.modelo}</td>
                      <td>{ord.numero_serie}</td>
                      <td>{ord.motivo_inativacao}</td>
                      <td>
                        <button className="btn verde" onClick={() => confirmarAtivacao(ord)}>ATIVAR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/ordemservico')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrdensInativas;
