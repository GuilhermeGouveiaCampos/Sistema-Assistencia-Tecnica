import React, { useState } from "react";
import './RecuperarSenha.css';
import { useNavigate } from "react-router-dom";

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

const RecuperarSenha: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [cpfValido, setCpfValido] = useState<boolean | null>(null);

  const navigate = useNavigate();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarCPF(e.target.value);
    setCpf(formatado);
    setCpfValido(validarCPF(formatado));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCPF(cpf)) {
      alert("CPF inválido");
      return;
    }

    console.log("Requisição de redefinição de senha enviada:", { cpf, novaSenha });
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
              <span style={{ color: cpfValido ? "lightgreen" : "red", fontSize: "0.8rem" }}>
                {cpfValido ? "CPF válido" : "CPF inválido"}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="novaSenha">NOVA SENHA</label>
            <input
              type="password"
              id="novaSenha"
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-entrar">
            REDEFINIR SENHA
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              marginTop: "1rem",
              backgroundColor: "#cccccc",
              color: "#1c1740",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: "bold",
              width: "100%",
              cursor: "pointer",
              border: "none"
            }}
          >
            VOLTAR PARA LOGIN
          </button>
        </form>
      </div>

      <div className="login-right">
        <img src="/eletricista.png" alt="Ilustração técnico" className="ilustracao" />
      </div>
    </div>
  );
};

export default RecuperarSenha;
