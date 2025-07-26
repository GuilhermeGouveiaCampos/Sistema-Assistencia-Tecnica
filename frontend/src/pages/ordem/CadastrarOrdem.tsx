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

interface Tecnico {
  id_tecnico: number;
  nome: string;
  cpf: string; 
  especializacao: string;
}

interface Local {
  id_scanner: string;
  local_instalado: string;
}

interface Status {
  id_status: number;
  descricao: string;
}

const CadastrarOrdem: React.FC = () => {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const idUsuario = localStorage.getItem("id") || "";

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);

  const [idCliente, setIdCliente] = useState('');
  const [idTecnico, setIdTecnico] = useState('');
  const [idLocal, setIdLocal] = useState('');
  const [idStatus, setIdStatus] = useState('');
  const [descricaoProblema, setDescricaoProblema] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [showDropdownTecnico, setShowDropdownTecnico] = useState(false);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<number | null>(null);


  useEffect(() => {
    axios.get('http://localhost:3001/api/ordens/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error("Erro ao buscar clientes:", err));

    axios.get('http://localhost:3001/api/tecnicos')
      .then(res => setTecnicos(res.data))
      .catch(err => console.error("Erro ao buscar técnicos:", err));

    axios.get('http://localhost:3001/api/locais')
      .then(res => setLocais(res.data))
      .catch(err => console.error("Erro ao buscar locais:", err));

    axios.get('http://localhost:3001/api/ordens/status-os')
    .then(res => setStatusList(res.data))
    .catch(err => console.error("Erro ao buscar status OS:", err));
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/ordens', {
        id_cliente: idCliente,
        id_tecnico: idTecnico,
        id_local: idLocal,
        id_status_os: idStatus,
        descricao_problema: descricaoProblema,
        data_criacao: dataCriacao
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao cadastrar OS:", error);
      alert("Erro ao cadastrar ordem de serviço.");
    }
  };
    function formatarCPF(cpf: string) {
      return cpf
        .replace(/\D/g, '') 
        .replace(/(\d{3})(\d)/, '$1.$2')       
        .replace(/(\d{3})(\d)/, '$1.$2')       
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') 
        .substring(0, 14);                    
    }

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
              
             <label className="autocomplete-container">
              <span>👤 CLIENTE</span>
              <input
                type="text"
                className="input-pesquisavel"
                placeholder="Busque por nome ou CPF"
                value={idCliente}
                onChange={(e) => {
                  const input = e.target.value;
                  const cpfFormatado = formatarCPF(input);
                  setIdCliente(cpfFormatado);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {showDropdown && (
                <ul className="autocomplete-dropdown">
                  {clientes
                    .filter(cli =>
                      `${cli.nome} ${cli.cpf}`.replace(/\D/g, '').toLowerCase()
                        .includes(idCliente.replace(/\D/g, '').toLowerCase())
                    )
                    .map(cli => (
                      <li
                        key={cli.id_cliente}
                        onClick={() => {
                          setIdCliente(`${cli.nome} - ${cli.cpf}`);
                          setSelectedClienteId(cli.id_cliente);
                          setShowDropdown(false);
                        }}
                      >
                        {cli.nome} - {cli.cpf}
                      </li>
                    ))}
                </ul>
              )}
            </label>

              <label className="autocomplete-container">
                <span>👨‍🔧 TÉCNICO</span>
                <input
                  type="text"
                  className="input-pesquisavel"
                  placeholder="Busque por nome ou CPF"
                  value={idTecnico}
                  onChange={(e) => {
                    const input = e.target.value;
                    const cpfFormatado = formatarCPF(input);
                    setIdTecnico(cpfFormatado);
                    setShowDropdownTecnico(true);
                  }}
                  onFocus={() => setShowDropdownTecnico(true)}
                  onBlur={() => setTimeout(() => setShowDropdownTecnico(false), 200)}
                />

                {showDropdownTecnico && (
                  <ul className="autocomplete-dropdown">
                    {tecnicos
                      .filter(tec =>
                        `${tec.nome} ${tec.cpf}`.replace(/\D/g, '').toLowerCase()
                          .includes(idTecnico.replace(/\D/g, '').toLowerCase())
                      )
                      .map(tec => (
                        <li
                          key={tec.id_tecnico}
                          onClick={() => {
                            setIdTecnico(`${tec.nome} - ${tec.cpf}`);
                            setSelectedTecnicoId(tec.id_tecnico);
                            setShowDropdownTecnico(false);
                          }}
                        >
                          {tec.nome} - {tec.cpf}
                        </li>
                      ))}
                  </ul>
                )}
              </label>


              <label>
                <span>🏢 LOCAL</span>
                <select value={idLocal} onChange={(e) => setIdLocal(e.target.value)} required>
                  <option value="">Selecione o local</option>
                  {locais.map(loc => (
                    <option key={loc.id_scanner} value={loc.id_scanner}>{loc.local_instalado}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>📌 STATUS</span>
                <select value={idStatus} onChange={(e) => setIdStatus(e.target.value)} required>
                  <option value="">Selecione o status</option>
                  {statusList.map(stat => (
                    <option key={stat.id_status} value={stat.id_status}>{stat.descricao}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>📝 DESCRIÇÃO DO PROBLEMA</span>
                <textarea value={descricaoProblema} onChange={(e) => setDescricaoProblema(e.target.value)} required />
              </label>

              <label>
                <span>📅 DATA DE ENTRADA</span>
                <input type="date" value={dataCriacao} onChange={(e) => setDataCriacao(e.target.value)} required />
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
