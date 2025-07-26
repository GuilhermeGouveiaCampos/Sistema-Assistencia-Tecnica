import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  motivo_inativacao: string;
}


const ClientesInativos: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");

  const [clientesInativos, setClientesInativos] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const carregarInativos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/clientes/inativos");
      setClientesInativos(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes inativos:", error);
    }
  };

  const ativarCliente = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/clientes/ativar/${id}`);
      carregarInativos();
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao ativar cliente:", error);
    }
  };

  const confirmarAtivacao = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setShowModal(true);
  };

  const cancelar = () => {
    setClienteSelecionado(null);
    setShowModal(false);
  };

  useEffect(() => {
    carregarInativos();
  }, []);

  return (
    <div className="dashboard-container">
        {showModal && clienteSelecionado && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <strong>CONFIRMAR ✅</strong>
            <button className="close-btn" onClick={cancelar}>X</button>
          </div>
          <div className="modal-body">
            <p>Deseja realmente reativar o cliente <strong>{clienteSelecionado.nome}</strong>?</p>
          </div>
          <div className="modal-footer">
            <button className="btn azul" onClick={() => ativarCliente(clienteSelecionado.id_cliente)}>CONFIRMAR</button>
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
          <button className="menu-btn" onClick={() => navigate("/clientes")}> <img src="/icon-clientes.png" alt="Ícone Clientes" /> <span>CLIENTES</span> </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}> <img src="/icon-equipamentos.png" alt="Ícone Equipamentos" /> <span>EQUIPAMENTOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}> <img src="/icon-os.png" alt="Ícone OS" /> <span>ORDEM DE SERVIÇO</span> </button>
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}> <img src="/icon-tecnicos.png" alt="Ícone Técnicos" /> <span>TÉCNICOS</span> </button>
              <button className="menu-btn" onClick={() => navigate("/rfid")}> <img src="/icon-rfid.png" alt="Ícone RFID" /> <span>RFID</span> </button>
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

        <h1 className="titulo-clientes">CLIENTES INATIVOS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes inativos">
              <table>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>CPF</th>
                    <th>TELEFONE</th>
                    <th>AÇÃO</th>
                  </tr>
                </thead>
                    <tbody>
                    {clientesInativos.map((cli) => (
                      <tr key={cli.id_cliente}>
                        <td>{cli.nome}</td>
                        <td>{cli.cpf}</td>
                        <td>{cli.motivo_inativacao}</td>
                        <td>
                          <button className="btn verde" onClick={() => confirmarAtivacao(cli)}>ATIVAR</button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/clientes')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientesInativos;
