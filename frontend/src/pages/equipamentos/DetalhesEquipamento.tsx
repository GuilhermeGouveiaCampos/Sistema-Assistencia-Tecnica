import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../dashboard/Dashboard.css';
import '../Css/Pesquisa.css';

interface Equipamento {
  id_equipamento: number;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  status: string;
  imagem: string; 
  nome_cliente: string;
  cpf: string;
}

const DetalhesEquipamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [equipamento, setEquipamento] = useState<Equipamento | null | undefined>(null);
  const navigate = useNavigate();
  const idUsuario = localStorage.getItem("id");

  useEffect(() => {
    const fetchEquipamento = async () => {
      try {
        console.log("🔄 Buscando detalhes do equipamento ID:", id);
        const response = await axios.get(`http://localhost:3001/api/equipamentos/${id}`);
        console.log("📦 Dados recebidos:", response.data);

        if (!response.data || response.data.erro) {
          console.warn("⚠️ Equipamento não encontrado.");
          setEquipamento(undefined);
        } else {
          setEquipamento(response.data);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar detalhes do equipamento:", error);
        setEquipamento(undefined);
      }
    };

    fetchEquipamento();
  }, [id]);

  if (equipamento === null) return <p>Carregando...</p>;
  if (equipamento === undefined) return <p>Equipamento não encontrado.</p>;

  const imagens = equipamento.imagem?.split(',') || [];
console.log("🖼️ Imagens do equipamento:", imagens);

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
            <span>Olá, {localStorage.getItem("nome") || "Usuário"}</span>
          </div>
        </header>

        <div className="clientes-content">
  <table className="tabela-detalhes">
    <tbody>
      <tr><th>Cliente</th><td>{equipamento.nome_cliente}</td></tr>
      <tr><th>CPF</th><td>{equipamento.cpf}</td></tr>
      <tr><th>Tipo</th><td>{equipamento.tipo}</td></tr>
      <tr><th>Marca</th><td>{equipamento.marca}</td></tr>
      <tr><th>Modelo</th><td>{equipamento.modelo}</td></tr>
      <tr><th>Nº Série</th><td>{equipamento.numero_serie}</td></tr>
    </tbody>
  </table>

  <h2 style={{ marginTop: "2rem" }}>Imagens</h2>
  <div className="galeria-imagens">
    {imagens.length === 0 ? (
      <p>Nenhuma imagem disponível.</p>
    ) : (
      imagens.map((img, index) => (
        <img
          key={index}
          src={`http://localhost:3001/uploads/${img}`}
          alt={`Imagem ${index + 1}`}
            onError={() => console.error(`❌ Falha ao carregar imagem: ${img}`)}

        />
      ))
    )}
  </div>

  <div className="voltar-container">
    <button className="btn roxo" onClick={() => navigate(-1)}>VOLTAR</button>


          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalhesEquipamento;
