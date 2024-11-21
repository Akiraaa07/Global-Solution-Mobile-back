const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
 
// Registrar Usuário
exports.registerUser = (req, res) => {
  const { username, senha } = req.body;
 
  if (!username || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }
 
  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });
 
    const sql = `
      INSERT INTO usuarios (nome, senha, role) 
      VALUES (?, ?, ?)
    `;
    const params = [username, hashedPassword, 'usuario'];
 
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Erro ao registrar usuário:', err);
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Nome já está em uso.' });
        }
        return res.status(500).json({ error: 'Erro ao registrar usuário.' });
      }
 
      res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        usuario_id: this.lastID,
      });
    });
  });
};
 
// Login de Usuário
exports.loginUser = (req, res) => {
  const { username, senha } = req.body;
 
  if (!username || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }
 
  const sql = `SELECT * FROM usuarios WHERE nome = ?`;
  db.get(sql, [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
 
    if (!user) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }
 
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Nome ou senha inválidos.' });
      }
 
      const token = jwt.sign(
        { id: user.usuario_id, role: user.role, nome: user.nome },
        'chave-secreta',
        { expiresIn: '24h' }
      );
 
      res.status(200).json({
        token,
        user: {
          id: user.usuario_id,
          nome: user.nome,
          role: user.role,
          data_cadastro: user.data_cadastro,
        },
      });
    });
  });
};
 
// Obter todos os usuários
exports.getUsers = (req, res) => {
  const sql = `
    SELECT usuario_id, nome, role, data_cadastro 
    FROM usuarios
  `;
 
  db.all(sql, [], (err, users) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
    res.status(200).json(users);
  });
};
 
// Obter usuário por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
 
  const sql = `
    SELECT usuario_id, nome, role, data_cadastro 
    FROM usuarios 
    WHERE usuario_id = ?
  `;
 
  db.get(sql, [id], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
 
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
 
    res.status(200).json(user);
  });
};
 
// Atualizar Usuário
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, senha, role } = req.body;
 
  if (!username) {
    return res.status(400).json({ error: 'O nome é obrigatório.' });
  }
 
  if (senha) {
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err.message });
 
      const sql = `
        UPDATE usuarios SET nome = ?, senha = ?, role = ? WHERE usuario_id = ?
      `;
      const params = [username, hashedPassword, role, id];
 
      db.run(sql, params, function (err) {
        if (err) {
          console.error('Erro ao atualizar usuário:', err);
          return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }
 
        if (this.changes) {
          res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } else {
          res.status(404).json({ error: 'Usuário não encontrado.' });
        }
      });
    });
  } else {
    const sql = `
      UPDATE usuarios SET nome = ?, role = ? WHERE usuario_id = ?
    `;
    const params = [username, role, id];
 
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
      }
 
      if (this.changes) {
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
      } else {
        res.status(404).json({ error: 'Usuário não encontrado.' });
      }
    });
  }
};
 
// Deletar Usuário
exports.deleteUser = (req, res) => {
  const { id } = req.params;
 
  const sql = `
    DELETE FROM usuarios WHERE usuario_id = ?
  `;
 
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
 
    if (this.changes) {
      res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  });
};