const db = require("../db/database");

// Adicionar Aparelho
exports.cadastrarAparelho = (req, res) => {
  const { nome, potencia, horas_uso } = req.body;
  const usuario_id = req.user.id;

  if (!nome || !potencia || !horas_uso) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const sql = `
      INSERT INTO aparelhos (usuario_id, nome, potencia, horas_uso) 
      VALUES (?, ?, ?, ?)
    `;

  db.run(sql, [usuario_id, nome, potencia, horas_uso], function (err) {
    if (err) {
      console.error("Erro ao cadastrar aparelho:", err);
      return res.status(500).json({ error: "Erro ao cadastrar aparelho" });
    }

    res
      .status(201)
      .json({
        message: "Aparelho cadastrado com sucesso!",
        aparelho_id: this.lastID,
      });
  });
};

// Listar Aparelhos
exports.listarAparelhos = (req, res) => {
  const usuario_id = req.user.id;

  if (req.user.role === "admin") {
    db.all(
      `SELECT a.*, u.nome AS usuario_nome 
             FROM aparelhos a
             JOIN usuarios u ON a.usuario_id = u.usuario_id
             ORDER BY a.data_cadastro DESC`,
      [],
      (err, rows) => {
        if (err) {
          console.error("Erro ao buscar aparelhos:", err);
          return res.status(500).json({ error: "Erro ao buscar aparelhos" });
        }
        res.status(200).json(rows);
      }
    );
  } else {
    db.all(
      `SELECT * FROM aparelhos WHERE usuario_id = ? ORDER BY data_cadastro DESC`,
      [usuario_id],
      (err, rows) => {
        if (err) {
          console.error("Erro ao buscar aparelhos:", err);
          return res.status(500).json({ error: "Erro ao buscar aparelhos" });
        }
        res.status(200).json(rows);
      }
    );
  }
};

// Obter Aparelho por ID
exports.obterAparelhoPorId = (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM aparelhos WHERE aparelho_id = ? AND usuario_id = ?",
    [id, req.user.id],
    (err, row) => {
      if (err) {
        console.error("Erro ao buscar aparelho:", err);
        return res.status(500).json({ error: "Erro ao buscar aparelho" });
      }
      if (row) {
        res.status(200).json(row);
      } else {
        res.status(404).json({ error: "Aparelho não encontrado" });
      }
    }
  );
};

// Atualizar Aparelho
exports.atualizarAparelho = (req, res) => {
  const { id } = req.params;
  const { nome, potencia, horas_uso } = req.body;

  if (!nome || !potencia || !horas_uso) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios (nome, potência, horas de uso)",
    });
  }

  const sql = `
    UPDATE aparelhos 
    SET nome = ?, potencia = ?, horas_uso = ? 
    WHERE aparelho_id = ? AND usuario_id = ?
  `;

  const params = [nome, potencia, horas_uso, id, req.user.id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Erro ao atualizar aparelho:", err);
      return res.status(500).json({ error: "Erro ao atualizar aparelho" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Aparelho não encontrado ou sem permissão" });
    }
    res.status(200).json({ message: "Aparelho atualizado com sucesso!" });
  });
};

// Deletar Aparelho
exports.deletarAparelho = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM aparelhos 
    WHERE aparelho_id = ? AND usuario_id = ?
  `;

  db.run(sql, [id, req.user.id], function(err) {
    if (err) {
      console.error("Erro ao deletar aparelho:", err);
      return res.status(500).json({ error: "Erro ao deletar aparelho" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Aparelho não encontrado ou sem permissão" });
    }
    res.status(200).json({ message: "Aparelho deletado com sucesso!" });
  });
};

// Atualizar Status do Aparelho (opcional)
exports.atualizarStatusAparelho = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ativo", "inativo", "em manutenção"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status inválido. Use: ativo, inativo ou em manutenção" });
  }

  db.run(
    "UPDATE aparelhos SET status = ? WHERE aparelho_id = ?",
    [status, id],
    function (err) {
      if (err) {
        console.error("Erro ao atualizar status do aparelho:", err);
        return res
          .status(500)
          .json({ error: "Erro ao atualizar status do aparelho" });
      }

      if (this.changes) {
        res.status(200).json({ message: "Status atualizado com sucesso!" });
      } else {
        res.status(404).json({ error: "Aparelho não encontrado" });
      }
    }
  );
};
