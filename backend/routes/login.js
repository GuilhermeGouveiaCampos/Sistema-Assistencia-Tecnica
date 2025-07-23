const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chave_super_secreta';

router.post('/', (req, res) => {
  const { cpf, senha } = req.body;

  console.log('🔐 Tentando login...');
  console.log('CPF recebido:', cpf);
  console.log('Senha recebida:', senha);

  if (!cpf || !senha) {
    console.log('❌ CPF ou senha não fornecidos');
    return res.status(400).json({ mensagem: 'CPF e senha são obrigatórios.' });
  }

  const cpfLimpo = cpf.replace(/\D/g, '');
  console.log('🔎 Buscando no banco com CPF limpo:', cpfLimpo);

  db.query('SELECT * FROM usuario WHERE cpf = ?', [cpfLimpo], async (err, results) => {
  if (err) {
    console.error('❌ Erro no banco:', err);
    return res.status(500).json({ mensagem: 'Erro no banco de dados' });
  }

  console.log('🔍 Resultado da consulta:', results);

  if (results.length === 0) {
    console.log('❌ Usuário não encontrado com CPF:', cpfLimpo);
    return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
  }

  const usuario = results[0];

  console.log('✅ Usuário encontrado:');
  console.log('→ Nome:', usuario.nome);
  console.log('→ CPF:', usuario.cpf);
  console.log('→ Hash salvo:', usuario.senha_hash);
  console.log('→ Comparando com senha:', senha);

    try {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

      console.log('🔍 Resultado da comparação com bcrypt:', senhaCorreta);

      if (!senhaCorreta) {
        console.log('❌ Senha incorreta para CPF:', cpfLimpo);
        return res.status(401).json({ mensagem: 'Senha incorreta.' });
      }

      const token = jwt.sign(
        { id: usuario.id_usuario, cpf: usuario.cpf },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log('✅ Login bem-sucedido para CPF:', cpfLimpo);

      res.json({
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: {
          id: usuario.id_usuario,
          nome: usuario.nome,
          cpf: usuario.cpf
        }
      });

    } catch (erroHash) {
      console.error('❌ Erro ao verificar hash da senha:', erroHash);
      res.status(500).json({ mensagem: 'Erro ao verificar a senha.' });
    }
  });
});

module.exports = router;
