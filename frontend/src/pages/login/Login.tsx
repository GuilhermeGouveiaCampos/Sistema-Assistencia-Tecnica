import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const formatarCPF = (valor: string): string => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const validarCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");
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

const Login: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [cpfValido, setCpfValido] = useState<boolean | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const formatado = formatarCPF(valor);
    setCpf(formatado);
    setCpfValido(validarCPF(formatado));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCPF(cpf)) {
      alert("CPF inválido.");
      return;
    }

    const payload = { cpf, senha };
    console.log("📤 Enviando dados para login:", payload);

    fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("📥 Status da resposta:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📥 Dados recebidos da API:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("nome", data.usuario.nome);
          localStorage.setItem("id", data.usuario.id);
          alert(`Bem-vindo, ${data.usuario.nome}`);
          navigate("/dashboard");
        } else {
          alert(data.mensagem || "Erro no login.");
        }
      })
      .catch((err) => {
        console.error("❌ Erro na requisição de login:", err);
        alert("Erro ao conectar com o servidor.");
      });
  };

  return (
    <div className="login-box">
      <div className="login-left">
        <img src="/logo.png" alt="Logo Eletrotek" className="logo" />

        <form className="form-area" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
            />
            {cpf.length === 14 && (
              <span
                style={{
                  color: cpfValido ? "lightgreen" : "red",
                  fontSize: "0.8rem",
                }}
              >
                {cpfValido ? "CPF válido" : "CPF inválido"}
              </span>
            )}
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="senha">SENHA</label>
            <input
              type={mostrarSenha ? "text" : "password"}
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value.replace(/\s/g, "").slice(0, 20))
              }
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={{
                position: "absolute",
                right: 10,
                top: "65%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
              title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? "🚫" : "👁️"}
            </button>
          </div>

          <div className="esqueceu">
            <a href="/recuperar-senha">ESQUECEU A SENHA?</a>
          </div>

          <button type="submit" className="btn-entrar">
            ENTRAR
          </button>
        </form>
      </div>

      <div className="login-right">
        <img
          src="/eletricista.png"
          alt="Ilustração técnico"
          className="ilustracao"
        />
      </div>
    </div>
  );
};

export default Login;
