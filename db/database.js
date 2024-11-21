const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
 
// Conectando ao banco de dados
const db = new sqlite3.Database(path.join(__dirname, '../lista-feedback.db'));
 
// Criando as tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'usuario',
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de feedbacks
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback_usuario (
      feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      mensagem TEXT,
      data_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
  `);
 
  // Tabela de aparelhos
  db.run(`
    CREATE TABLE IF NOT EXISTS aparelhos (
      aparelho_id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      nome TEXT NOT NULL,
      potencia INTEGER NOT NULL,
      horas_uso INTEGER NOT NULL,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
    )
  `);
 
  // Verificar e criar o usuário admin
  db.get("SELECT * FROM usuarios WHERE email = 'admin@example.com'", [], (err, adminRow) => {
    if (err) {
      console.error('Erro ao verificar usuário admin:', err);
      return;
    }
 
    if (!adminRow) {
      bcrypt.hash('admin123', 10, (err, hashedPassword) => {
        if (err) {
          console.error('Erro ao criar hash da senha do admin:', err);
          return;
        }
 
        db.run(
          "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
          ['Administrador', 'admin@example.com', hashedPassword, 'admin'],
          function (err) {
            if (err) {
              console.error('Erro ao criar usuário admin:', err);
            } else {
              console.log('Usuário admin criado com sucesso!');
            }
          }
        );
      });
    }
  });
 
  // Verificar e criar o usuário de teste
  db.get("SELECT * FROM usuarios WHERE email = 'teste@example.com'", [], (err, row) => {
    if (err) {
      console.error('Erro ao verificar usuário teste:', err);
      return;
    }
 
    if (!row) {
      bcrypt.hash('123456', 10, (err, hashedPassword) => {
        if (err) {
          console.error('Erro ao criar hash da senha:', err);
          return;
        }
 
        db.run(
          "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
          ['Usuário Teste', 'teste@example.com', hashedPassword, 'usuario'],
          function (err) {
            if (err) {
              console.error('Erro ao criar usuário teste:', err);
            } else {
              console.log('Usuário teste criado com sucesso!');
            }
          }
        );
      });
    }
  });
});
 
// Log de erros no banco de dados
db.on('error', (err) => {
  console.error('Erro no banco de dados:', err);
});
 
module.exports = db;