import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Alterar.css";
import "../Css/Cadastrar.css";
import "../Css/Pesquisa.css";
import "../dashboard/Dashboard.css";

const AlterarTecnico: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const tecnicoStorage = localStorage.getItem("tecnicoSelecionado");

  const [idTecnico, setIdTecnico] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!tecnicoStorage) {
      alert("Nenhum técnico selecionado.");
      navigate("/tecnicos");
      return;
    }

    const tecnico = JSON.parse(tecnicoStorage);
    setIdTecnico(tecnico.id_tecnico);
    setNome(tecnico.nome);
    setCpf(tecnico.cpf);
    setTelefone(tecnico.telefone);
  }, [navigate, tecnicoStorage]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idTecnico) {
      alert("Dados inválidos.");
      return;
    }

    const tecnicoAtualizado = { nome, cpf, telefone };

    try {
      await axios.put(`http://localhost:3001/api/tecnicos/${idTecnico}`, tecnicoAtualizado);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao atualizar técnico:", error);
      alert("Erro ao atualizar técnico.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Modal de confirmação de saída */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <strong>CONFIRMAR ?</strong>
              <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
            </div>
            <p>Deseja mesmo sair sem salvar?</p>
            <p><strong>Técnico:</strong> {nome}</p>
            <button
              className="btn azul"
              onClick={() => {
                localStorage.removeItem("tecnicoSelecionado");
                navigate("/tecnicos");
              }}
            >
              CONFIRMAR
            </button>
          </div>
        </div>
      )}

      {/* Modal de sucesso */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <strong>✅ Sucesso!</strong>
              <button
                className="close-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  localStorage.removeItem("tecnicoSelecionado");
                  navigate("/tecnicos");
                }}
              >X</button>
            </div>
            <p>Técnico <strong>{nome}</strong> atualizado com sucesso!</p>
            <div className="modal-footer">
              <button
                className="btn azul"
                onClick={() => {
                  setShowSuccessModal(false);
                  localStorage.removeItem("tecnicoSelecionado");
                  navigate("/tecnicos");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="Logo" /></div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}><img src="/icon-clientes.png" alt="" /><span>CLIENTES</span></button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}><img src="/icon-equipamentos.png" alt="" /><span>EQUIPAMENTOS</span></button>
          <button className="menu-btn" onClick={() => navigate("/ordemservico")}><img src="/icon-os.png" alt="" /><span>ORDEM DE SERVIÇO</span></button>
          <button className="menu-btn" onClick={() => navigate("/tecnicos")}><img src="/icon-tecnicos.png" alt="" /><span>TÉCNICOS</span></button>
          <button className="menu-btn" onClick={() => navigate("/rfid")}><img src="/icon-rfid.png" alt="" /><span>RFID</span></button>
          <button className="menu-btn" onClick={() => navigate("/usuarios")}><img src="/icon-usuarios.png" alt="Ícone Usuários" /><span>USUÁRIOS</span></button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">ALTERAR TÉCNICO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>👤 NOME</span>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </label>

              <label>
                <span>📄 CPF</span>
                <input type="text" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} maxLength={14} required />
              </label>

              <label>
                <span>📞 TELEFONE</span>
                <input type="text" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} maxLength={15} required />
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => setShowModal(true)}>CANCELAR</button>
              </div>

              <div className="voltar-container">
                <button className="btn roxo" type="button" onClick={() => setShowModal(true)}>VOLTAR</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AlterarTecnico;
