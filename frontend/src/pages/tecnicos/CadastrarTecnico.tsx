import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AxiosError } from 'axios';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css'; 
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';

const CadastrarTecnico: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [showModal, setShowModal] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoTecnico = {
      nome,
      cpf,
      telefone,
      especializacao,
      status: 'ativo'
    };

    try {
      const response = await axios.post('http://localhost:3001/api/tecnicos', novoTecnico);
      console.log("✅ Técnico cadastrado com sucesso:", response.data);
      setShowModal(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error("❌ Erro ao cadastrar técnico:", axiosError);
      alert("Erro ao cadastrar técnico.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Modal de sucesso */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <strong>SUCESSO ✅</strong>
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                navigate('/tecnicos');
              }}>X</button>
            </div>
            <div className="modal-body">
              <p>Técnico <strong>{nome}</strong> cadastrado com sucesso!</p>
              <button className="btn azul" onClick={() => navigate('/tecnicos')}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
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
          <button className="menu-btn" onClick={() => navigate("/ordens")}>
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
                <img src="/icon-usuarios.png" alt="Ícone Usuários" />
                <span>USUÁRIOS</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">CADASTRAR TÉCNICO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>👤 NOME</span>
                <input type="text" placeholder="Digite o nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
              </label>

              <label>
                <span>📄 CPF</span>
                <input type="text" placeholder="Digite o CPF" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} required />
              </label>

              <label>
                <span>📞 TELEFONE</span>
                <input type="text" placeholder="Digite o telefone" value={telefone} onChange={e => setTelefone(formatTelefone(e.target.value))} maxLength={15} required />
              </label>

              <label>
                <span>🎓 ESPECIALIZAÇÃO</span>
                <input type="text" placeholder="Ex: Eletrônicos, Informática..." value={especializacao} onChange={e => setEspecializacao(e.target.value)} required />
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => navigate('/tecnicos')}>CANCELAR</button>
              </div>
              <div className="voltar-container">
                <button className="btn roxo" onClick={() => navigate('/tecnicos')}>VOLTAR</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CadastrarTecnico;
