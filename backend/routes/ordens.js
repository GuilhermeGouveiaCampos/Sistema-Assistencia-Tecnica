const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Cadastrar nova ordem de serviço
router.post('/', (req, res) => {
  const {
    id_cliente,
    id_tecnico,
    id_local,
    id_status_os,
    descricao_problema,
    descricao_servico,
    data_criacao,
    data_inicio_reparo,
    data_fim_reparo,
    tempo_servico
  } = req.body;

  const sql = `
    INSERT INTO ordenservico (
      id_cliente, id_tecnico, id_local, id_status_os,
      descricao_problema, descricao_servico, data_criacao,
      data_inicio_reparo, data_fim_reparo, tempo_servico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    id_cliente,
    id_tecnico,
    id_local,
    id_status_os,
    descricao_problema,
    descricao_servico,
    data_criacao,
    data_inicio_reparo,
    data_fim_reparo,
    tempo_servico
  ], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar ordem de serviço:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar ordem de serviço.' });
    }

    res.status(201).json({ mensagem: 'Ordem cadastrada com sucesso!' });
  });
});

// 🔹 Buscar clientes ativos
router.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_cliente, nome, cpf FROM cliente WHERE status = "ativo"');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes.' });
  }
});


// 🔹 Buscar técnicos ativos
router.get('/tecnicos', (req, res) => {
  db.query('SELECT id_tecnico, nome, cpf FROM tecnico WHERE status = "ativo"', (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar técnicos.' });
    res.json(result);
  });
});

// 🔹 Buscar locais ativos
router.get('/locais', (req, res) => {
  db.query('SELECT id_scanner AS id_local, local_instalado FROM local WHERE status = "ativo"', (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar locais.' });
    res.json(result);
  });
});

// 🔹 Buscar status de OS
router.get('/status-os', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM status_os');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar status_os:', error);
    res.status(500).json({ erro: 'Erro ao buscar status_os' });
  }
});

// backend/routes/local.js
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_scanner, local_instalado, status_interno FROM local');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar locais:', err);
    res.status(500).json({ erro: 'Erro ao buscar locais' });
  }
});



// 🔍 Buscar ordens de serviço com JOIN em cliente e status_os
router.get('/', async (req, res) => {
  const { nome_cliente, status } = req.query;

  let sql = `
    SELECT 
      o.*, 
      c.nome AS nome_cliente,
      s.descricao AS status_descricao
    FROM ordenservico o
    JOIN cliente c ON o.id_cliente = c.id_cliente
    LEFT JOIN status_os s ON o.id_status = s.id_status
    WHERE 1=1
  `;
  const params = [];

  if (nome_cliente) {
    sql += ' AND c.nome LIKE ?';
    params.push(`%${nome_cliente}%`);
  }

  if (status) {
    sql += ' AND o.id_status_os = ?';
    params.push(status);
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ Erro ao buscar ordens de serviço:', error);
    res.status(500).json({ erro: 'Erro ao buscar ordens de serviço' });
  }
});
router.get('/menos-carregados', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.id_tecnico, t.nome, COUNT(o.id_tecnico) AS total_os
      FROM tecnico t
      LEFT JOIN ordenservico o ON t.id_tecnico = o.id_tecnico
      GROUP BY t.id_tecnico
      ORDER BY total_os ASC
      LIMIT 1
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar técnico menos carregado:", err);
    res.status(500).json({ erro: "Erro interno ao buscar técnico balanceado" });
  }
});


module.exports = router;