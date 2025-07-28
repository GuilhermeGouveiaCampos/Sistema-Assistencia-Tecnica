const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/menos-carregados', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id_tecnico,
        t.nome,
        COUNT(o.id_os) AS total_ordens
      FROM tecnico t
      LEFT JOIN ordenservico o ON o.id_tecnico = t.id_tecnico
      WHERE t.status = 'ativo'
      GROUP BY t.id_tecnico
      ORDER BY total_ordens ASC
      LIMIT 1
    `);

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar técnico menos carregado:", error);
    res.status(500).json({ erro: "Erro interno ao buscar técnico balanceado" });
  }
});

module.exports = router;
