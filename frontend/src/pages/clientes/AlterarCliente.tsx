import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/Alterar.css';
import '../Css/Cadastrar.css'; 
import '../Css/Pesquisa.css';
import '../dashboard/Dashboard.css';


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import { FaCalendarAlt } from 'react-icons/fa';

const AlterarCliente: React.FC = () => {
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id");
  const navigate = useNavigate();

  const [idCliente, setIdCliente] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const clienteString = localStorage.getItem("clienteSelecionado");

    if (!clienteString) {
      alert("Nenhum cliente selecionado.");
      navigate('/clientes');
      return;
    }

    const cliente = JSON.parse(clienteString);
    setIdCliente(cliente.id_cliente);
    setNome(cliente.nome);
    setCpf(cliente.cpf);
    setTelefone(cliente.telefone);
    if (cliente.data_nascimento) {
      setDataNascimento(new Date(cliente.data_nascimento));
    }
  }, [navigate]);

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

    if (!idCliente || !dataNascimento) {
      alert("Dados inválidos.");
      return;
    }

    const clienteAtualizado = {
      nome,
      cpf,
      telefone,
      data_nascimento: dataNascimento.toISOString().split('T')[0]
    };

    try {
      await axios.put(`http://localhost:3001/api/clientes/${idCliente}`, clienteAtualizado);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar cliente.');
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

      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar-img" />
            <span>Olá, {nomeUsuario}</span>
          </div>
        </header>

        <h1 className="titulo-clientes">ALTERAR CLIENTES</h1>

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
                  onChange={e => setCpf(formatCPF(e.target.value))}
                  maxLength={14}
                  required
                />
              </label>

              <label>
                <span>📞 TELEFONE</span>
                <input
                  type="text"
                  value={telefone}
                  onChange={e => setTelefone(formatTelefone(e.target.value))}
                  maxLength={15}
                  required
                />
              </label>

              <label>
                <span>📅 DATA DE NASCIMENTO</span>
                <div className="data-picker-wrapper">
                  <DatePicker
                    selected={dataNascimento}
                    onChange={(date: Date | null) => setDataNascimento(date)}
                    locale={ptBR}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    className="custom-datepicker"
                    showIcon
                    icon={<FaCalendarAlt color="#fff" />}
                  />
                </div>
              </label>

              <div className="acoes-clientes">
                <button type="submit" className="btn azul">SALVAR</button>
                <button
                  type="button"
                  className="btn preto"
                  onClick={() => {
                    localStorage.removeItem("clienteSelecionado");
                    navigate('/clientes');
                  }}
                >
                  CANCELAR
                </button>
              </div>

              <div className="voltar-container">
                <button
                  className="btn roxo"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  VOLTAR
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Modal de confirmação de saída */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <strong>CONFIRMAR ?</strong>
                <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
              </div>
              <p>Deseja mesmo sair sem salvar?</p>
              <p><strong>Cliente:</strong> {nome}</p>
              <button
                className="btn azul"
                onClick={() => {
                  localStorage.removeItem("clienteSelecionado");
                  navigate('/clientes');
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
                    localStorage.removeItem("clienteSelecionado");
                    navigate('/clientes');
                  }}
                >X</button>
              </div>
              <p>Cliente <strong>{nome}</strong> atualizado com sucesso!</p>
              <div className="modal-footer">
                <button
                  className="btn azul"
                  onClick={() => {
                    setShowSuccessModal(false);
                    localStorage.removeItem("clienteSelecionado");
                    navigate('/clientes');
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AlterarCliente;
