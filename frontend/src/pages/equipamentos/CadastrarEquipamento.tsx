import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../dashboard/Dashboard.css";
import "../Css/Cadastrar.css";
import "../Css/Alterar.css";
import "../Css/Pesquisa.css";

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
}

const CadastrarEquipamento: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formulario, setFormulario] = useState({
    id_cliente: "",
    tipo: "",
    marca: "",
    modelo: "",
    numero_serie: "",
  });
  const [cpfCliente, setCpfCliente] = useState<string>("");
  const [imagens, setImagens] = useState<File[]>([]);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };
    carregarClientes();
  }, []);

  // ✅ UseEffect que redireciona após exibir modal de sucesso
  useEffect(() => {
    if (mostrarModalSucesso) {
      const timer = setTimeout(() => {
        navigate("/equipamentos");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mostrarModalSucesso]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "id_cliente") {
      const clienteSelecionado = clientes.find(c => c.id_cliente === parseInt(value));
      setCpfCliente(clienteSelecionado ? clienteSelecionado.cpf : "");
    }

    setFormulario({ ...formulario, [name]: value });
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const selectedFiles = Array.from(e.target.files).slice(0, 20); // limitar a 20
    setImagens(selectedFiles);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   const dados = new FormData();
    dados.append("id_cliente", formulario.id_cliente);
    dados.append("tipo", formulario.tipo);
    dados.append("marca", formulario.marca);
    dados.append("modelo", formulario.modelo);
    dados.append("numero_serie", formulario.numero_serie);
    dados.append("status", "ativo");

    imagens.forEach((imagem) => {
      dados.append("imagens", imagem); 
    });


    console.log("📤 Enviando dados para o backend...");

    try {
      const response = await axios.post("http://localhost:3001/api/equipamentos", dados, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Resposta do backend:", response);
      console.log("🔁 Status da resposta:", response.status);

      if (response.status === 201 || response.status === 200) {
        setMostrarModalSucesso(true);
        console.log("🎉 Modal de sucesso ativado!");
      } else {
        console.warn("⚠️ Resposta inesperada:", response.status);
        alert("Algo deu errado. Verifique o console.");
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erro de Axios:", error.response?.data || error.message);
      } else {
        console.error("❌ Erro desconhecido:", error);
      }
      alert("Erro ao cadastrar equipamento. Veja o console.");
    }
  };

  // ✅ Debug para garantir que o modal está sendo acionado
  console.log("mostrarModalSucesso:", mostrarModalSucesso);

  return (
    <div className="dashboard-container">

      {/* BOTÃO DE TESTE */}
      <button
        style={{ position: "fixed", top: 10, right: 10, zIndex: 10000 }}
        onClick={() => setMostrarModalSucesso(true)}
      >
        FORÇAR MODAL
      </button>

      {/* MODAL DE SUCESSO */}
      {mostrarModalSucesso && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          backgroundColor: '#fff',
          border: '2px solid #000',
          padding: '20px',
          zIndex: 9999,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px"
        }}>
          <h2>✅ SUCESSO!</h2>
          <p>Equipamento cadastrado com sucesso.</p>
          <button onClick={() => setMostrarModalSucesso(false)}>Fechar</button>
        </div>
      )}

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
            <img src="/icon-os.png" alt="Ícone OS" /> <span>ORDEM DE SERVIÇO</span>
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

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">CADASTRAR EQUIPAMENTO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="cliente-select-group">
                <label>
                  <span>👤 CLIENTE</span>
                  <select
                    name="id_cliente"
                    value={formulario.id_cliente}
                    onChange={handleChange}
                    required
                    className="input-estilizado"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>📄 CPF DO CLIENTE</span>
                  <div className="cpf-disabled-wrapper">
                    <input type="text" value={cpfCliente} disabled className="input-estilizado" />
                  </div>
                </label>
              </div>

              <label>
                <span>⚙️ TIPO DO EQUIPAMENTO</span>
                <input
                  type="text"
                  name="tipo"
                  placeholder="Ex: Liquidificador"
                  value={formulario.tipo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>🏷️ MARCA</span>
                <input
                  type="text"
                  name="marca"
                  placeholder="Ex: Mondial"
                  value={formulario.marca}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>📦 MODELO</span>
                <input
                  type="text"
                  name="modelo"
                  placeholder="Ex: Power 600W"
                  value={formulario.modelo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>🔢 NÚMERO DE SÉRIE</span>
                <input
                  type="text"
                  name="numero_serie"
                  placeholder="Ex: AB123456"
                  value={formulario.numero_serie}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>📷 FOTOS DO EQUIPAMENTO</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagemChange}
                />
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => navigate("/equipamentos")}>CANCELAR</button>
              </div>

              <div className="voltar-container">
                <button className="btn roxo" type="button" onClick={() => navigate("/equipamentos")}>VOLTAR</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CadastrarEquipamento;