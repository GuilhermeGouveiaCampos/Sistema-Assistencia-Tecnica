import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ConfirmarExclusao from '../../components/ConfirmarExclusao';
import '../dashboard/Dashboard.css';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css'; 
import '../Css/Pesquisa.css';

interface Usuario {
  id_usuario: number;
  nome: string;
  cpf: string;
  id_nivel: number;
  nome_nivel: string; // <-- ADICIONADO
}


const Usuarios: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const consultarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/usuarios", {
        params: { nome: nomeFiltro, cpf: cpfFiltro }
      });
      setUsuarios(response.data);
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao consultar usuários:", error);
    }
  };

  useEffect(() => {
    consultarUsuarios();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => consultarUsuarios(), 400);
    return () => clearTimeout(delay);
  }, [nomeFiltro, cpfFiltro]);

  const selecionarUsuario = (user: Usuario) => {
    if (!user?.id_usuario) return;
    setUsuarioSelecionado(user.id_usuario);
  };

  const abrirModalExclusao = () => {
    if (usuarioSelecionado !== null) setMostrarModal(true);
  };

  const excluirUsuario = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${usuarioSelecionado}`);
      setMostrarModal(false);
      consultarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const usuarioAtual = usuarios.find(u => u.id_usuario === usuarioSelecionado);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}> <img src="/icon-clientes.png" alt="Clientes" /> <span>CLIENTES</span> </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}> <img src="/icon-equipamentos.png" alt="Equipamentos" /> <span>EQUIPAMENTOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}> <img src="/icon-os.png" alt="OS" /> <span>ORDEM DE SERVIÇO</span> </button>
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}> <img src="/icon-tecnicos.png" alt="Técnicos" /> <span>TÉCNICOS</span> </button>
              <button className="menu-btn" onClick={() => navigate("/rfid")}> <img src="/icon-rfid.png" alt="RFID" /> <span>RFID</span> </button>
              <button className="menu-btn" onClick={() => navigate("/usuarios")}> <img src="/icon-usuarios.png" alt="Usuários" /> <span>USUÁRIOS</span> </button>
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

        <h1 className="titulo-clientes">USUÁRIOS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="filtros-clientes">
              <input type="text" placeholder="NOME" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
              <input type="text" placeholder="CPF" value={cpfFiltro} onChange={(e) => setCpfFiltro(formatarCPF(e.target.value))} />
              <button className="btn roxo-claro" onClick={consultarUsuarios}>CONSULTAR</button>
            </div>

            <div className="tabela-clientes">
              <table>
                <thead>
                <tr>
                  <th>NOME</th>
                  <th>NÍVEL</th>
                  <th>CPF</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario} onClick={() => selecionarUsuario(u)} className={usuarioSelecionado === u.id_usuario ? 'linha-selecionada' : ''}>
                    <td>{u.nome}</td>
                    <td>{u.nome_nivel}</td> 
                    <td>{formatarCPF(u.cpf)}</td>
                  </tr>
                ))}
              </tbody>

              </table>
            </div>

            <div className="acoes-clientes">
              <button className="btn azul" onClick={() => navigate('/usuarios/cadastrar')}>CADASTRAR</button>
              <button className="btn preto" disabled={usuarioSelecionado === null} onClick={() => {
                const usuario = usuarios.find(u => u.id_usuario === usuarioSelecionado);
                if (usuario) {
                  localStorage.setItem("usuarioSelecionado", JSON.stringify(usuario));
                  navigate('/usuarios/editar');
                }
              }}>ALTERAR</button>
              <button className="btn vermelho" disabled={usuarioSelecionado === null} onClick={abrirModalExclusao}>EXCLUIR</button>
              <button className="btn vermelho-claro" onClick={() => navigate('/usuarios/inativos')}>INATIVOS</button>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate('/')}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>

      {mostrarModal && usuarioAtual && (
        <ConfirmarExclusao
          nomeCliente={usuarioAtual.nome}
          onConfirmar={excluirUsuario}
          onFechar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Usuarios;
