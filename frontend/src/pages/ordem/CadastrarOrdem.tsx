// pages/ordens/CadastrarOrdem.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../dashboard/Dashboard.css';
import '../Css/Cadastrar.css';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
}

const CadastrarOrdem: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id") || "";

const [clientes, setClientes] = useState<Cliente[]>([]);
  const [idCliente, setIdCliente] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [estado, setEstado] = useState('Em análise');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/clientes/ativos')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/ordens', {
        id_cliente: idCliente,
        descricao,
        data_entrada: dataEntrada,
        estado
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao cadastrar OS:", error);
      alert("Erro ao cadastrar ordem de serviço.");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo.png" alt="Logo" /></div>
        <nav className="sidebar-menu">
          <button className="menu-btn" onClick={() => navigate("/clientes")}><img src="/icon-clientes.png" alt="" /> CLIENTES</button>
          <button className="menu-btn" onClick={() => navigate("/equipamentos")}><img src="/icon-equipamentos.png" alt="" /> EQUIPAMENTOS</button>
          <button className="menu-btn" onClick={() => navigate("/ordens")}><img src="/icon-os.png" alt="" /> ORDEM DE SERVIÇO</button>
          {idUsuario === "1" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/tecnicos")}><img src="/icon-tecnicos.png" alt="" /> TÉCNICOS</button>
              <button className="menu-btn" onClick={() => navigate("/rfid")}><img src="/icon-rfid.png" alt="" /> RFID</button>
              <button className="menu-btn" onClick={() => navigate("/usuarios")}><img src="/icon-usuarios.png" alt="" /> USUÁRIOS</button>
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

        <h1 className="titulo-clientes">CADASTRAR ORDEM DE SERVIÇO</h1>

        <section className="clientes-section">
          <div className="container-central">
            <form className="form-cadastro-clientes" onSubmit={handleSubmit}>
              <label>
                <span>👤 CLIENTE</span>
                <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)} required>
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cli) => (
                    <option key={cli.id_cliente} value={cli.id_cliente}>
                      {cli.nome} - {cli.cpf}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>📝 DESCRIÇÃO DO PROBLEMA</span>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
              </label>

              <label>
                <span>📅 DATA DE ENTRADA</span>
                <input type="date" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} required />
              </label>

              <label>
                <span>📌 ESTADO</span>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="Em análise">Em análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button type="button" className="btn preto" onClick={() => navigate('/ordens')}>CANCELAR</button>
              </div>
            </form>
          </div>
        </section>

        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <strong>✅ Sucesso!</strong>
                <button className="close-btn" onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/ordens');
                }}>X</button>
              </div>
              <p>Ordem de serviço cadastrada com sucesso!</p>
              <div className="modal-footer">
                <button className="btn azul" onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/ordens');
                }}>OK</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CadastrarOrdem;
