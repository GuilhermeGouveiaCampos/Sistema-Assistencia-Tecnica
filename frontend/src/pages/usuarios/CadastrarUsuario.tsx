import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../dashboard/Dashboard.css";
import "../Css/Cadastrar.css";
import bcrypt from "bcryptjs";

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


const CadastrarUsuario: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";

  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    id_nivel: "1",
    especializacao: "",
    telefone: "",
  });

  const [cpfValido, setCpfValido] = useState<boolean | null>(null);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const formatarCPF = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const novoValor = name === "cpf" ? formatarCPF(value) : value;

    setFormulario((prev) => ({ ...prev, [name]: novoValor }));

    if (name === "cpf") {
      const somenteNumeros = novoValor.replace(/\D/g, ""); 
      if (somenteNumeros.length === 11) {
        setCpfValido(validarCPF(somenteNumeros));
      } else {
        setCpfValido(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCPF(formulario.cpf)) {
      alert("CPF inválido.");
      return;
    }

    try {
      const senhaHash = await bcrypt.hash(formulario.senha, 10);

      // Cadastro do usuário
      const response = await axios.post("http://localhost:3001/api/usuarios", {
        nome: formulario.nome,
        cpf: formulario.cpf,
        email: formulario.email,
        senha: senhaHash,
        id_nivel: Number(formulario.id_nivel),
        status: "ativo",
      });

      const id_usuario = response.data.id_usuario;

      // Se for técnico (id_nivel === 3), cadastra também na tabela tecnico
      if (formulario.id_nivel === "3") {
        await axios.post("http://localhost:3001/api/tecnicos", {
          nome: formulario.nome,
          especializacao: formulario.especializacao,
          telefone: formulario.telefone,
          status: "ativo",
          id_usuario,
        });
      }

      setMostrarModalSucesso(true);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="dashboard-container">
      {mostrarModalSucesso && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <strong>SUCESSO ✅</strong>
              <button className="close-btn" onClick={() => {
                setMostrarModalSucesso(false);
                navigate('/usuarios');
              }}>X</button>
            </div>
            <div className="modal-body">
              <p>Usuário cadastrado com sucesso!</p>
              <button className="btn azul" onClick={() => navigate('/usuarios')}>OK</button>
            </div>
          </div>
        </div>
      )}

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
            <img src="/icon-usuarios.png" alt="" />
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

        <h1 className="titulo-clientes">CADASTRAR USUÁRIO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>👤 NOME</span>
                <input type="text" name="nome" required value={formulario.nome} onChange={handleChange} />
              </label>

              <label>
                <span>📄 CPF</span>
                <input type="text" name="cpf" required value={formulario.cpf} onChange={handleChange} />
                {cpfValido !== null && (
                  <p style={{ color: cpfValido ? "green" : "red", fontSize: "0.9rem", marginTop: "5px" }}>
                    {cpfValido ? "CPF válido ✅" : "CPF inválido ❌"}
                  </p>
                )}
              </label>

              <label>
                <span>📧 E-MAIL</span>
                <input type="email" name="email" required value={formulario.email} onChange={handleChange} />
              </label>

              <label>
                <span>🔒 SENHA</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    required
                    value={formulario.senha}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{ marginLeft: "5px", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
                  >
                    {mostrarSenha ? "🚫" : "👁️"}
                  </button>
                </div>
              </label>

              <label>
                <span>🛡️ NÍVEL DE ACESSO</span>
                <select name="id_nivel" value={formulario.id_nivel} onChange={handleChange} required>
                  <option value="1">Gerente</option>
                  <option value="2">Atendente</option>
                  <option value="3">Técnico</option>
                </select>
              </label>

              {formulario.id_nivel === "3" && (
                <>
                  <label>
                    <span>📚 ESPECIALIZAÇÃO</span>
                    <input
                      type="text"
                      name="especializacao"
                      value={formulario.especializacao}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    <span>📞 TELEFONE</span>
                    <input
                      type="text"
                      name="telefone"
                      value={formulario.telefone}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </>
              )}

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => navigate("/usuarios")}>CANCELAR</button>
              </div>

              <div className="voltar-container">
                <button type="button" className="btn roxo" onClick={() => navigate("/usuarios")}>VOLTAR</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CadastrarUsuario;
