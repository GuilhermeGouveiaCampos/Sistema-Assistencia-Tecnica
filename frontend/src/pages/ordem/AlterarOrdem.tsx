import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../dashboard/Dashboard.css";
import "../Css/Cadastrar.css";
import "../Css/Alterar.css";
import "../Css/Pesquisa.css";

const AlterarOrdem: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id") || "";

  const [idOrdem, setIdOrdem] = useState<number | null>(null);
  const [descricaoProblema, setDescricaoProblema] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [status, setStatus] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const ordemString = localStorage.getItem("ordemSelecionada");
    if (!ordemString) {
      alert("Nenhuma ordem selecionada.");
      navigate('/ordemservico');
      return;
    }

    const ordem = JSON.parse(ordemString);
    setIdOrdem(ordem.id_ordem);
    setDescricaoProblema(ordem.descricao_problema);
    setDiagnostico(ordem.diagnostico);
    setStatus(ordem.status);
    setPrevisaoEntrega(ordem.previsao_entrega?.substring(0, 10)); // yyyy-mm-dd
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idOrdem) {
      alert("ID da ordem inválido.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/ordemservico/${idOrdem}`, {
        descricao_problema: descricaoProblema,
        diagnostico,
        status,
        previsao_entrega: previsaoEntrega,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
      alert("Erro ao atualizar ordem de serviço.");
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
            <img src="/icon-os.png" alt="Ícone OS" /> <span>ORDENS DE SERVIÇO</span>
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

        <h1 className="titulo-clientes">ALTERAR ORDEM DE SERVIÇO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>📝 PROBLEMA</span>
                <textarea value={descricaoProblema} onChange={e => setDescricaoProblema(e.target.value)} required />
              </label>

              <label>
                <span>🛠️ DIAGNÓSTICO</span>
                <textarea value={diagnostico} onChange={e => setDiagnostico(e.target.value)} />
              </label>

              <label>
                <span>📌 STATUS</span>
                <select value={status} onChange={e => setStatus(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="em análise">Em Análise</option>
                  <option value="em reparo">Em Reparo</option>
                  <option value="aguardando peça">Aguardando Peça</option>
                  <option value="aguardando aprovação">Aguardando Aprovação</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </label>

              <label>
                <span>📅 PREVISÃO DE ENTREGA</span>
                <input type="date" value={previsaoEntrega} onChange={e => setPrevisaoEntrega(e.target.value)} />
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button
                  type="button"
                  className="btn preto"
                  onClick={() => {
                    localStorage.removeItem("ordemSelecionada");
                    navigate('/ordemservico');
                  }}
                >
                  CANCELAR
                </button>
              </div>

              <div className="voltar-container">
                <button className="btn roxo" type="button" onClick={() => setShowModal(true)}>
                  VOLTAR
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Modal de confirmação */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <strong>CONFIRMAR ?</strong>
                <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
              </div>
              <p>Deseja sair sem salvar?</p>
              <button
                className="btn azul"
                onClick={() => {
                  localStorage.removeItem("ordemSelecionada");
                  navigate('/ordemservico');
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
                <button className="close-btn" onClick={() => {
                  setShowSuccessModal(false);
                  localStorage.removeItem("ordemSelecionada");
                  navigate('/ordemservico');
                }}>X</button>
              </div>
              <p>Ordem de serviço atualizada com sucesso!</p>
              <div className="modal-footer">
                <button className="btn azul" onClick={() => {
                  setShowSuccessModal(false);
                  localStorage.removeItem("ordemSelecionada");
                  navigate('/ordemservico');
                }}>OK</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AlterarOrdem;
