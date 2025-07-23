const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Buscar locais ativos
router.get('/', async (req, res) => {
  const { local } = req.query;
  let query = 'SELECT * FROM local WHERE status != "inativo"';
  const params = [];

  if (local) {
    query += ' AND local_instalado LIKE ?';
    params.push(`%${local}%`);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar locais:', err);
    res.status(500).json({ erro: 'Erro ao buscar locais.' });
  }
});

// 🔍 Buscar locais inativos
router.get('/inativos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM local WHERE status = "inativo"');
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar locais inativos:', err);
    res.status(500).json({ erro: 'Erro ao buscar locais inativos.' });
  }
});

// ➕ Cadastrar novo local
router.post('/', async (req, res) => {
  const { id_scanner, local_instalado, status, status_interno } = req.body;

  if (!id_scanner || !local_instalado || !status) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  try {
    await db.query(
      'INSERT INTO local (id_scanner, local_instalado, status, status_interno) VALUES (?, ?, ?, ?)',
      [id_scanner, local_instalado, status, status_interno || null]
    );
    res.status(201).json({ mensagem: 'Local cadastrado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao cadastrar local:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar local.' });
  }
});

// 📝 Inativar local (com motivo)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, motivo_inativacao } = req.body;

  if (typeof status !== 'string' || typeof motivo_inativacao !== 'string' || !status.trim() || !motivo_inativacao.trim()) {
    return res.status(400).json({ error: 'Dados incompletos para inativação.' });
  }

  try {
    await db.query('UPDATE local SET status = ?, motivo_inativacao = ? WHERE id_scanner = ?', [
      status.trim(),
      motivo_inativacao.trim(),
      id
    ]);
    res.status(200).json({ message: 'Local inativado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao inativar local:', err);
    res.status(500).json({ error: 'Erro ao atualizar local.' });
  }
});

// ❌ Exclusão lógica (não utilizada, mas mantida)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE local SET status = "inativo" WHERE id_scanner = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Local não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Local marcado como inativo com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao inativar local:', err);
    res.status(500).json({ erro: 'Erro ao inativar local.' });
  }
});

// ✅ Reativar local
router.put('/ativar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE local SET status = "Recebido" WHERE id_scanner = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Local não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Local reativado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao reativar local:', err);
    res.status(500).json({ erro: 'Erro ao reativar local.' });
  }
});

module.exports = router;
