const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // ✅ ESSA LINHA ESTAVA FALTANDO
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Servir arquivos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔌 Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'assistencia_tecnica'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err.message);
  } else {
    console.log('✅ Conectado ao MySQL!');
  }
});

// 🌐 Deixa o db acessível em outras rotas
app.set('db', db);

// 🧪 Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

// 🚀 Rotas externas
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

const clientesRouter = require('./routes/clientes');
app.use('/api/clientes', clientesRouter);

const equipamentosRouter = require('./routes/equipamentos');
app.use('/api/equipamentos', equipamentosRouter); 

const rfidRoutes = require('./routes/rfid');
app.use('/api/locais', rfidRoutes);

const rotaTecnicos = require('./routes/tecnicos');
app.use('/api/tecnicos', rotaTecnicos);

// 🔊 Inicializa servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

