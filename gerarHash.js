const bcrypt = require('bcryptjs');

bcrypt.hash('IreiPassar', 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('HASH GERADO:', hash);
});
