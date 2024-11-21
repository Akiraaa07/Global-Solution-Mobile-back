const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../lista-feedback.db'));

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS feedback", (err) => {
    if (err) {
      console.error('Erro ao dropar tabela feedback:', err);
    } else {
      console.log('Tabela feedbacks removida com sucesso');
    }
  });

  db.run("DROP TABLE IF EXISTS pacientes", (err) => {
    if (err) {
      console.error('Erro ao dropar tabela pacientes:', err);
    } else {
      console.log('Tabela pacientes removida com sucesso');
    }
  });

  db.run("DROP TABLE IF EXISTS sintomas", (err) => {
    if (err) {
      console.error('Erro ao dropar tabela sintomas:', err);
    } else {
      console.log('Tabela sintomas removida com sucesso');
    }
  });

  db.run("DROP TABLE IF EXISTS usuarios", (err) => {
    if (err) {
      console.error('Erro ao dropar tabela usuarios:', err);
    } else {
      console.log('Tabela usuarios removida com sucesso');
    }
  });

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='feedback'", (err, row) => {
    if (err) {
      console.error('Erro ao verificar tabela feedback:', err);
    } else {
      console.log('Status da tabela feedback:', row ? 'Existe' : 'Não existe');
    }
  });

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='pacientes'", (err, row) => {
    if (err) {
      console.error('Erro ao verificar tabela pacientes:', err);
    } else {
      console.log('Status da tabela pacientes:', row ? 'Existe' : 'Não existe');
    }
  });

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='sintomas'", (err, row) => {
    if (err) {
      console.error('Erro ao verificar tabela sintomas:', err);
    } else {
      console.log('Status da tabela sintomas:', row ? 'Existe' : 'Não existe');
    }
  });

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'", (err, row) => {
    if (err) {
      console.error('Erro ao verificar tabela usuarios:', err);
    } else {
      console.log('Status da tabela usuarios:', row ? 'Existe' : 'Não existe');
    }
  });

});

db.close((err) => {
  if (err) {
    console.error('Erro ao fechar conexão:', err);
  } else {
    console.log('Limpeza concluída');
  }
}); 