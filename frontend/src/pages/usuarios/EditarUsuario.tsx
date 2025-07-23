import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css';
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';

const AlterarUsuario: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuarioLogado = localStorage.getItem("id");
  const navigate = useNavigate();

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [idNivel, setIdNivel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validarCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cleaned[i]) * (10 - i);
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== parseInt(cleaned[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cleaned[i]) * (11 - i);
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;

  return digito2 === parseInt(cleaned[10]);
};

const [cpfValido, setCpfValido] = useState<boolean | null>(null);


  useEffect(() => {
    const usuarioString = localStorage.getItem("usuarioSelecionado");
    if (!usuarioString) {
      alert("Nenhum usuário selecionado.");
      navigate('/usuarios');
      return;
    }
    const usuario = JSON.parse(usuarioString);
    setIdUsuario(usuario.id_usuario);
    setNome(usuario.nome);
    setCpf(usuario.cpf);
    setEmail(usuario.email);
    setIdNivel(usuario.id_nivel);
  }, [navigate]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!idUsuario) return;

  const cpfNumerico = cpf.replace(/\D/g, '');

  if (!validarCPF(cpfNumerico)) {
    alert("CPF inválido.");
    return;
  }

  try {
    await axios.put(`http://localhost:3001/api/usuarios/${idUsuario}`, {
      nome,
      cpf,
      email,
      id_nivel: idNivel,
    });
    setShowSuccessModal(true);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    alert("Erro ao atualizar usuário.");
  }
};


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}> <img src="/icon-clientes.png" alt="Clientes" /> <span>CLIENTES</span> </button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}> <img src="/icon-equipamentos.png" alt="Equipamentos" /> <span>EQUIPAMENTOS</span> </button>
          <button className="menu-btn" onClick={() => navigate("/ordens")}> <img src="/icon-os.png" alt="OS" /> <span>ORDENS DE SERVIÇO</span> </button>
          {idUsuarioLogado === "1" && (
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

        <h1 className="titulo-clientes">ALTERAR USUÁRIO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>👤 NOME</span>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
              </label>
              <label>
                <span>📄 CPF</span>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => {
                    const novoCPF = formatCPF(e.target.value);
                    setCpf(novoCPF);

                    const somenteNumeros = novoCPF.replace(/\D/g, '');
                    if (somenteNumeros.length === 11) {
                      setCpfValido(validarCPF(somenteNumeros));
                    } else {
                      setCpfValido(null);
                    }
                  }}
                  maxLength={14}
                  required
                />
                {cpfValido !== null && (
                  <p style={{
                    color: cpfValido ? "green" : "red",
                    fontSize: "0.9rem",
                    marginTop: "5px",
                    fontWeight: "bold"
                  }}>
                    {cpfValido ? "CPF válido ✅" : "CPF inválido ❌"}
                  </p>
                )}

              </label>
              <label>
                <span>📧 EMAIL</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>
                <span>🧑‍💼 NÍVEL</span>
                <select value={idNivel} onChange={e => setIdNivel(e.target.value)} required>
                  <option value="1">Administrador</option>
                  <option value="2">Atendente</option>
                  <option value="3">Técnico</option>
                </select>
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => navigate('/usuarios')}>CANCELAR</button>
              </div>
            </form>
          </div>
        </section>
        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <strong>CONFIRMAR SAÍDA?</strong>
                  <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                </div>
                <p>Deseja sair sem salvar?</p>
                <button className="btn azul" onClick={() => navigate('/usuarios')}>
                  CONFIRMAR
                </button>
              </div>
            </div>
          )}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <strong>CONFIRMAR SAÍDA?</strong>
                    <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                  </div>
                  <p>Deseja mesmo sair sem salvar?</p>
                  <p><strong>Usuário:</strong> {nome}</p>
                  <button
                    className="btn azul"
                    onClick={() => {
                      localStorage.removeItem("usuarioSelecionado");
                      navigate('/usuarios');
                    }}
                  >
                    CONFIRMAR
                  </button>
                </div>
              </div>
            )}

        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <strong>✅ Sucesso!</strong>
                <button className="close-btn" onClick={() => { setShowSuccessModal(false); navigate('/usuarios'); }}>X</button>
              </div>
              <p>Usuário <strong>{nome}</strong> atualizado com sucesso!</p>
              <div className="modal-footer">
                <button className="btn azul" onClick={() => { setShowSuccessModal(false); navigate('/usuarios'); }}>OK</button>
              </div>
            </div>
          </div>
        )}
                  <div className="voltar-container">
            <button
              className="btn roxo"
              type="button"
              onClick={() => setShowModal(true)}
            >
              VOLTAR
            </button>
          </div>

      </main>
    </div>
  );
};

export default AlterarUsuario;
