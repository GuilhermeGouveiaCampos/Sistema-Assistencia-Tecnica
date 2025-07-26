import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../dashboard/Dashboard.css";
import "../Css/Pesquisa.css";

interface Tecnico {
  id_tecnico: number;
  nome: string;
  cpf: string;
  telefone: string;
}

const TecnicosInativos: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const [tecnicosInativos, setTecnicosInativos] = useState<Tecnico[]>([]);

  const formatarCPF = (valor?: string): string => {
  if (!valor) return "";
  const apenasNumeros = valor.replace(/\D/g, "");
  return apenasNumeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .slice(0, 14);
};


  const formatarTelefone = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const buscarInativos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/tecnicos/inativos");
      setTecnicosInativos(res.data);
    } catch (error) {
      console.error("Erro ao buscar técnicos inativos:", error);
    }
  };

  const ativarTecnico = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/tecnicos/ativar/${id}`);
      buscarInativos(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao ativar técnico:", error);
    }
  };

  useEffect(() => {
    buscarInativos();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}> <img src="/icon-clientes.png" alt="" /> <span>CLIENTES</span> </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}> <img src="/icon-equipamentos.png" alt="" /> <span>EQUIPAMENTOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}> <img src="/icon-os.png" alt="" /> <span>ORDEM DE SERVIÇO</span> </button>
          <button className="menu-btn" onClick={() => navigate("/tecnicos")}> <img src="/icon-tecnicos.png" alt="" /> <span>TÉCNICOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/rfid")}> <img src="/icon-rfid.png" alt="" /> <span>RFID</span> </button>
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

        <h1 className="titulo-clientes">TÉCNICOS INATIVOS</h1>

        <section className="clientes-section">
          <div className="container-central">
            <div className="tabela-clientes">
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
                  {tecnicosInativos.map((tec) => (
                    <tr key={tec.id_tecnico}>
                      <td>{tec.nome}</td>
                      <td>{formatarCPF(tec.cpf)}</td>
                      <td>{formatarTelefone(tec.telefone)}</td>
                      <td>
                        <button className="btn verde" onClick={() => ativarTecnico(tec.id_tecnico)}>
                          ATIVAR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="voltar-container">
              <button className="btn roxo" onClick={() => navigate("/tecnicos")}>VOLTAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TecnicosInativos;
