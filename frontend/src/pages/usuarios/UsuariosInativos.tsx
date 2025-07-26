import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../dashboard/Dashboard.css";
import "../Css/Pesquisa.css";

interface Usuario {
  id_usuario: number;
  nome: string;
  cpf: string;
  id_nivel: number;
  nome_nivel: string;
  status: string;
}


const UsuariosInativos: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const [usuariosInativos, setUsuariosInativos] = useState<Usuario[]>([]);

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const buscarUsuariosInativos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/usuarios/inativos");
      setUsuariosInativos(res.data);
    } catch (error) {
      console.error("Erro ao buscar usuários inativos:", error);
    }
  };

  const ativarUsuario = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/usuarios/${id}/ativar`);
      buscarUsuariosInativos(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao ativar usuário:", error);
    }
  };

  useEffect(() => {
    buscarUsuariosInativos();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}>
            <img src="/icon-clientes.png" alt="" />
            <span>CLIENTES</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}>
            <img src="/icon-equipamentos.png" alt="" />
            <span>EQUIPAMENTOS</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}>
            <img src="/icon-os.png" alt="" />
            <span>ORDEM DE SERVIÇO</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/tecnicos")}>
            <img src="/icon-tecnicos.png" alt="" />
            <span>TÉCNICOS</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/rfid")}>
            <img src="/icon-rfid.png" alt="" />
            <span>RFID</span>
          </button>
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

        <h1 className="titulo-clientes">USUÁRIOS INATIVOS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes">
              <table>
                 <thead>
                <tr>
                  <th>NOME</th>
                  <th>NÍVEL</th>
                  <th>CPF</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {usuariosInativos.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.nome_nivel}</td>
                    <td>{formatarCPF(usuario.cpf)}</td>
                    <td>
                      <button className="btn verde" onClick={() => ativarUsuario(usuario.id_usuario)}>
                        ATIVAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate("/usuarios")}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UsuariosInativos;
