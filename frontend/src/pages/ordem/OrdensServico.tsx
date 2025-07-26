import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ConfirmarExclusao from '../../components/ConfirmarExclusao';
import '../dashboard/Dashboard.css';
import '../Css/Pesquisa.css';

interface OrdemServico {
  id_ordem: number;
  id_cliente: number;
  nome_cliente: string;
  tipo_equipamento: string;
  modelo: string;
  data_entrada: string;
  status: string;
}

const OrdensServico: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [ordemSelecionada, setOrdemSelecionada] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const consultarOrdens = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/ordens", {
        params: {
          nome_cliente: clienteFiltro,
          status: statusFiltro,
        },
      });
      setOrdens(response.data);
      setOrdemSelecionada(null);
    } catch (error) {
      console.error("Erro ao consultar ordens de serviço:", error);
    }
  };

  useEffect(() => {
    consultarOrdens();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      consultarOrdens();
    }, 400);
    return () => clearTimeout(delay);
  }, [clienteFiltro, statusFiltro]);

  const selecionarOrdem = (ordem: OrdemServico) => {
    setOrdemSelecionada(ordem.id_ordem);
  };

  const excluirOrdem = async () => {
    if (ordemSelecionada === null) return;
    try {
      await axios.delete(`http://localhost:3001/api/ordens/${ordemSelecionada}`);
      setOrdens(ordens.filter(o => o.id_ordem !== ordemSelecionada));
      setOrdemSelecionada(null);
      setMostrarModal(false);
    } catch (error) {
      console.error("Erro ao excluir ordem:", error);
    }
  };

  const ordemAtual = ordens.find(o => o.id_ordem === ordemSelecionada);

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
                <img src="/icon-usuarios.png" alt="Ícone Usuários" /> <span>USUÁRIOS</span>
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

        <h1 className="titulo-clientes">ORDENS DE SERVIÇO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="filtros-clientes">
              <input type="text" placeholder="NOME DO CLIENTE" value={clienteFiltro} onChange={(e) => setClienteFiltro(e.target.value)} />
              <input type="text" placeholder="STATUS" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} />
              <button className="btn roxo-claro" onClick={consultarOrdens}>CONSULTAR</button>
            </div>

            <div className="tabela-clientes">
              <table>
                <thead>
                  <tr>
                    <th>CLIENTE</th>
                    <th>EQUIPAMENTO</th>
                    <th>MODELO</th>
                    <th>DATA ENTRADA</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map((o) => (
                    <tr
                      key={o.id_ordem}
                      onClick={() => selecionarOrdem(o)}
                      className={ordemSelecionada === o.id_ordem ? 'linha-selecionada' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{o.nome_cliente}</td>
                      <td>{o.tipo_equipamento}</td>
                      <td>{o.modelo}</td>
                      <td>{o.data_entrada}</td>
                      <td>{o.status}</td>
                      <td>
                        <button
                          className="btn detalhes"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            navigate(`/ordemservico/detalhes/${o.id_ordem}`);
                          }}
                        >
                          DETALHES
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="acoes-clientes">
              <button className="btn azul" onClick={() => navigate('/ordemservico/cadastrar')}>NOVA ORDEM DE SERVIÇO</button>

              <button
                className="btn preto"
                disabled={ordemSelecionada === null}
                onClick={() => {
                  const ordem = ordens.find(o => o.id_ordem === ordemSelecionada);
                  if (ordem) {
                    localStorage.setItem("ordemSelecionada", JSON.stringify(ordem));
                    navigate('/ordemservico/editar');
                  }
                }}
              >
                ALTERAR
              </button>

              <button className="btn vermelho" disabled={ordemSelecionada === null} onClick={() => setMostrarModal(true)}>
                EXCLUIR
              </button>

              <button className="btn vermelho-claro" onClick={() => navigate('/ordemservico/inativas')}>
                INATIVAS
              </button>
            </div>
          </div>
        </section>

        <div className="voltar-container">
          <button className="btn roxo" onClick={() => navigate('/')}>VOLTAR</button>
        </div>

        {mostrarModal && ordemAtual && (
          <ConfirmarExclusao
            nomeCliente={`${ordemAtual.nome_cliente} - ${ordemAtual.tipo_equipamento}`}
            onConfirmar={excluirOrdem}
            onFechar={() => setMostrarModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default OrdensServico;
