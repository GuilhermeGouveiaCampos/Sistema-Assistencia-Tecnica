import React, { useState } from "react";
import "./Login.css";

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

    // Aqui futuramente:
    // fetch("http://localhost:3001/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ cpf, senha })
    // })

    console.log("Verificação de login será feita aqui...");
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
            <label htmlFor="senha">SENHA</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value.replace(/\s/g, "").slice(0, 20))
              }
            />
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
        <img src="/eletricista.png" alt="Ilustração técnico" className="ilustracao" />
      </div>
    </div>
  );
};

export default Login;
