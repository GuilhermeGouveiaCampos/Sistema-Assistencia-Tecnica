const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Buscar clientes ativos com filtros opcionais
router.get('/', async (req, res) => {
  const { nome, cpf } = req.query;
  let query = 'SELECT * FROM cliente WHERE status = "ativo"';
  const params = [];

  if (nome) {
    query += ' AND nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (cpf) {
    query += ' AND cpf LIKE ?';
    params.push(`%${cpf}%`);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar clientes ativos:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

// 🔍 Buscar clientes inativos
router.get('/inativos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cliente WHERE status = "inativo"');
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar clientes inativos:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes inativos.' });
  }
});

// ✅ Ativar cliente
router.put('/ativar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE cliente SET status = "ativo" WHERE id_cliente = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Cliente ativado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao ativar cliente:', err);
    res.status(500).json({ erro: 'Erro ao ativar cliente.' });
  }
});

// ❌ Inativar cliente (exclusão lógica)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE cliente SET status = "inativo" WHERE id_cliente = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Cliente marcado como inativo com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao inativar cliente:', err);
    res.status(500).json({ erro: 'Erro ao marcar cliente como inativo.' });
  }
});

// 📝 Atualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, data_nascimento } = req.body;

  console.log("🛠️ PUT /api/clientes/:id");
  console.log("➡️ ID recebido:", id);
  console.log("📦 Body recebido:", req.body);

  if (!nome || !cpf || !telefone || !data_nascimento) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE cliente SET nome = ?, cpf = ?, telefone = ?, data_nascimento = ? WHERE id_cliente = ?',
      [nome, cpf, telefone, data_nascimento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao atualizar cliente:', err);
    res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
  }
});

// 🔍 Buscar cliente por ID (sempre por último para não causar conflito com outras rotas)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Erro ao buscar cliente por ID:', err);
    res.status(500).json({ erro: 'Erro ao buscar cliente.' });
  }
});
// ➕ Cadastrar novo cliente
router.post('/', async (req, res) => {
  const { nome, cpf, telefone, data_nascimento } = req.body;

  console.log("📥 POST /api/clientes");
  console.log("📦 Body recebido:", req.body);

  if (!nome || !cpf || !telefone || !data_nascimento) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO cliente (nome, cpf, telefone, data_nascimento, status) VALUES (?, ?, ?, ?, "ativo")',
      [nome, cpf, telefone, data_nascimento]
    );

    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso.', id_cliente: result.insertId });
  } catch (err) {
    console.error('❌ Erro ao cadastrar cliente:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar cliente.' });
  }
});

module.exports = router;
