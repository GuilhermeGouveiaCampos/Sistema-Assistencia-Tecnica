const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔍 Buscar usuários ativos com filtros opcionais + nome_nivel
router.get('/', async (req, res) => {
  const { nome, cpf } = req.query;
  let query = `
    SELECT u.id_usuario, u.nome, u.cpf, u.email, u.id_nivel, n.nome_nivel, u.status
    FROM usuario u
    JOIN nivel n ON u.id_nivel = n.id_nivel
    WHERE u.status = 'ativo'
  `;
  const params = [];

  if (nome) {
    query += ' AND u.nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (cpf) {
    query += ' AND u.cpf LIKE ?';
    params.push(`%${cpf}%`);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar usuários ativos:', err);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// 🔍 Buscar usuários inativos com nome_nivel
router.get('/inativos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nome, u.cpf, u.email, u.id_nivel, n.nome_nivel, u.status
      FROM usuario u
      JOIN nivel n ON u.id_nivel = n.id_nivel
      WHERE u.status = "inativo"
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Erro ao buscar usuários inativos:', err);
    res.status(500).json({ erro: 'Erro ao buscar usuários inativos.' });
  }
});

// ✅ Ativar usuário
router.put('/:id/ativar', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE usuario SET status = "ativo" WHERE id_usuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário ativado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao ativar usuário:', err);
    res.status(500).json({ erro: 'Erro ao ativar usuário.' });
  }
});

// ❌ Inativar usuário (exclusão lógica)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE usuario SET status = "inativo" WHERE id_usuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário marcado como inativo com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao inativar usuário:', err);
    res.status(500).json({ erro: 'Erro ao marcar usuário como inativo.' });
  }
});

// 📝 Atualizar usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, email, id_nivel } = req.body;

  if (!nome || !cpf || !email || !id_nivel) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE usuario SET nome = ?, cpf = ?, email = ?, id_nivel = ? WHERE id_usuario = ?',
      [nome, cpf, email, id_nivel, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao atualizar usuário:', err);
    res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
  }
});

// 🔍 Buscar usuário por ID com nome_nivel
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nome, u.cpf, u.email, u.id_nivel, n.nome_nivel, u.status
      FROM usuario u
      JOIN nivel n ON u.id_nivel = n.id_nivel
      WHERE u.id_usuario = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Erro ao buscar usuário por ID:', err);
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
});

// ➕ Cadastrar novo usuário e, se for técnico, também na tabela tecnico
router.post('/', async (req, res) => {
  const { nome, cpf, email, senha, id_nivel, especializacao, telefone } = req.body;

  if (!nome || !cpf || !email || !senha || !id_nivel) {
    return res.status(400).json({ erro: 'Todos os campos obrigatórios do usuário devem ser preenchidos.' });
  }

  const conn = await db.getConnection(); // ⛓ conexão única para transação

  try {
    await conn.beginTransaction();

    // Inserir usuário
    const [usuarioResult] = await conn.query(
      'INSERT INTO usuario (nome, cpf, email, senha_hash, id_nivel, status) VALUES (?, ?, ?, ?, ?, "ativo")',
      [nome, cpf, email, senha, id_nivel]
    );

    const id_usuario = usuarioResult.insertId;

    // Se for técnico (id_nivel === 2), inserir na tabela tecnico
    if (Number(id_nivel) === 2) {
      if (!especializacao || !telefone) {
        await conn.rollback();
        return res.status(400).json({ erro: 'Campos de técnico são obrigatórios para nível técnico.' });
      }

      await conn.query(
        'INSERT INTO tecnico (nome, especializacao, telefone, status, id_usuario) VALUES (?, ?, ?, "ativo", ?)',
        [nome, especializacao, telefone, id_usuario]
      );
    }

    await conn.commit();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', id_usuario });

  } catch (err) {
    await conn.rollback();
    console.error('❌ Erro ao cadastrar usuário/técnico:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
