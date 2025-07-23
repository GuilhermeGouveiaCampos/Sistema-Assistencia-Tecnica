import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ConfirmarExclusao from '../../components/ConfirmarExclusao';
import '../dashboard/Dashboard.css';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css'; 
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  telefone: string;
}

const Clientes: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const consultarClientes = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:3001/api/clientes", {
        params: {
          nome: nomeFiltro,
          cpf: cpfFiltro
        }
      });

      setClientes(response.data);
      setClienteSelecionado(null);
    } catch (error) {
      console.error("\u274c Erro ao consultar clientes:", error);
    }
  };

  useEffect(() => {
    consultarClientes();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      consultarClientes();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [nomeFiltro, cpfFiltro]);

  const selecionarCliente = (cli: Cliente) => {
    if (!cli || !cli.id_cliente) {
      console.warn("Cliente inválido:", cli);
      return;
    }
    console.log("Selecionado:", cli.id_cliente);
    setClienteSelecionado(cli.id_cliente);
  };

  const abrirModalExclusao = () => {
    if (clienteSelecionado !== null) setMostrarModal(true);
  };

  const excluirCliente = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/clientes/${clienteSelecionado}`);
      setMostrarModal(false);
      consultarClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const clienteAtual = clientes.find(c => c.id_cliente === clienteSelecionado);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}> <img src="/icon-clientes.png" alt="Ícone Clientes" /> <span>CLIENTES</span> </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}> <img src="/icon-equipamentos.png" alt="Ícone Equipamentos" /> <span>EQUIPAMENTOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/ordens")}> <img src="/icon-os.png" alt="Ícone Ordem de Serviço" /> <span>ORDEM DE SERVIÇO</span> </button>
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
             <h1 className="titulo-clientes">CLIENTES</h1>
        <section className="clientes-section">
          <div className="container-central">
            

            <div className="filtros-clientes">
              <input type="text" placeholder="NOME COMPLETO" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
              <input type="text" placeholder="CPF" value={cpfFiltro} onChange={(e) => setCpfFiltro(formatarCPF(e.target.value))} />
              <button className="btn roxo-claro" onClick={consultarClientes}>CONSULTAR</button>
            </div>

            <div className="tabela-clientes">
              <table>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>CPF</th>
                    <th>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>TELEFONE</span>
                        {clienteSelecionado !== null && (
                          <button onClick={() => setClienteSelecionado(null)} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>DESMARCAR</button>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cli) => (
                    <tr key={cli.id_cliente} onClick={() => selecionarCliente(cli)} className={clienteSelecionado === cli.id_cliente ? 'linha-selecionada' : ''} style={{ cursor: 'pointer' }}>
                      <td>{cli.nome}</td>
                      <td>{cli.cpf}</td>
                      <td>{cli.telefone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="acoes-clientes">
  <button className="btn azul" onClick={() => navigate('/clientes/cadastrar')}>CADASTRAR</button>

  <button
    className="btn preto"
    disabled={clienteSelecionado === null}
    onClick={() => {
      const cliente = clientes.find(c => c.id_cliente === clienteSelecionado);
      if (cliente) {
        localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));
        navigate('/clientes/editar');
      }
    }}
  >
    ALTERAR
  </button>

  <button className="btn vermelho" disabled={clienteSelecionado === null} onClick={abrirModalExclusao}>EXCLUIR</button>

  <button className="btn vermelho-claro" onClick={() => navigate('/clientes/inativos')}>INATIVOS</button>
</div>


            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>

      {mostrarModal && clienteAtual && (
        <ConfirmarExclusao
          nomeCliente={clienteAtual.nome}
          onConfirmar={excluirCliente}
          onFechar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Clientes;
