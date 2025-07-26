import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ConfirmarExclusao from '../../components/ConfirmarExclusao';
import '../dashboard/Dashboard.css';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css';
import '../Css/Pesquisa.css';

interface Tecnico {
  id_tecnico: number;
  nome: string;
  cpf: string;
  telefone: string;
}

const Tecnicos: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const consultarTecnicos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tecnicos", {
        params: {
          nome: nomeFiltro,
          cpf: cpfFiltro
        }
      });
      setTecnicos(response.data);
      setTecnicoSelecionado(null);
    } catch (error) {
      console.error("Erro ao buscar técnicos:", error);
    }
  };

  useEffect(() => {
    consultarTecnicos();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      consultarTecnicos();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [nomeFiltro, cpfFiltro]);

  const selecionarTecnico = (tec: Tecnico) => {
    if (!tec || !tec.id_tecnico) return;
    setTecnicoSelecionado(tec.id_tecnico);
  };

  const abrirModalExclusao = () => {
    if (tecnicoSelecionado !== null) setMostrarModal(true);
  };

  const excluirTecnico = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/tecnicos/${tecnicoSelecionado}`);
      setMostrarModal(false);
      consultarTecnicos();
    } catch (error) {
      console.error("Erro ao excluir técnico:", error);
    }
  };

  const tecnicoAtual = tecnicos.find(t => t.id_tecnico === tecnicoSelecionado);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="Logo" /></div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}><img src="/icon-clientes.png" alt="" /><span>CLIENTES</span></button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}><img src="/icon-equipamentos.png" alt="" /><span>EQUIPAMENTOS</span></button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}><img src="/icon-os.png" alt="" /><span>ORDEM DE SERVIÇO</span></button>
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}><img src="/icon-tecnicos.png" alt="" /><span>TÉCNICOS</span></button>
              <button className="menu-btn" onClick={() => navigate("/rfid")}><img src="/icon-rfid.png" alt="" /><span>RFID</span></button>
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

        <h1 className="titulo-clientes">TÉCNICOS</h1>

        <section className="clientes-section">
          <div className="container-central">

            <div className="filtros-clientes">
              <input type="text" placeholder="NOME COMPLETO" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
              <input type="text" placeholder="CPF" value={cpfFiltro} onChange={(e) => setCpfFiltro(formatarCPF(e.target.value))} />
              <button className="btn roxo-claro" onClick={consultarTecnicos}>CONSULTAR</button>
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
                        {tecnicoSelecionado !== null && (
                          <button onClick={() => setTecnicoSelecionado(null)} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>DESMARCAR</button>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tecnicos.map((tec) => (
                    <tr key={tec.id_tecnico} onClick={() => selecionarTecnico(tec)} className={tecnicoSelecionado === tec.id_tecnico ? 'linha-selecionada' : ''} style={{ cursor: 'pointer' }}>
                      <td>{tec.nome}</td>
                      <td>{tec.cpf}</td>
                      <td>{tec.telefone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="acoes-clientes">
              <button className="btn azul" onClick={() => navigate('/tecnicos/cadastrar')}disabled>CADASTRAR</button>
              <button className="btn preto" disabled={tecnicoSelecionado === null} onClick={() => {
                const tecnico = tecnicos.find(t => t.id_tecnico === tecnicoSelecionado);
                if (tecnico) {
                  localStorage.setItem('tecnicoSelecionado', JSON.stringify(tecnico));
                  navigate('/tecnicos/editar');
                }
              }}>ALTERAR</button>
              <button className="btn vermelho" disabled={tecnicoSelecionado === null} onClick={abrirModalExclusao}>EXCLUIR</button>
              <button className="btn vermelho-claro" onClick={() => navigate('/tecnicos/inativos')}>INATIVOS</button>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>

      {mostrarModal && tecnicoAtual && (
        <ConfirmarExclusao
          nomeCliente={tecnicoAtual.nome}
          onConfirmar={excluirTecnico}
          onFechar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Tecnicos;

