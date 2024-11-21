const db = require('../db/database');
 

exports.adicionarFeedback = (req, res) => {
    const { mensagem, data_feedback } = req.body;
    const usuario_id = req.user.id;
    const dataFeedback = data_feedback || new Date().toISOString();
 
    if (!mensagem || mensagem.trim() === '') {
        return res.status(400).json({ error: 'Mensagem do feedback é obrigatória' });
    }
 
    const sql = `
    INSERT INTO feedback_usuario (usuario_id, mensagem, data_feedback) 
    VALUES (?, ?, ?)
`;
 
    const params = [usuario_id, mensagem, dataFeedback];
 
    db.run(sql, params, function (err) {
        if (err) {
            console.error('Erro ao inserir feedback:', err);
            return res.status(500).json({ error: 'Erro ao criar feedback' });
        }
 
        const feedbackId = this.lastID;
        db.get(
            "SELECT * FROM feedback_usuario WHERE feedback_id = ?",
            [feedbackId],
            (err, row) => {
                if (err) {
                    console.error('Erro ao buscar feedback criado:', err);
                    return res.status(500).json({ error: 'Erro ao buscar feedback' });
                }
                res.status(201).json(row);
            }
        );
    });
};
 
exports.obterFeedbacks = (req, res) => {
    if (req.user.role === 'admin') {
        db.all(
            `SELECT f.*, u.nome 
             FROM feedback_usuario f 
             JOIN usuarios u ON f.usuario_id = u.usuario_id 
             ORDER BY f.data_feedback DESC`,
            [],
            (err, rows) => {
                if (err) {
                    console.error('Erro ao buscar feedbacks:', err);
                    return res.status(500).json({ error: 'Erro ao buscar feedbacks' });
                }
                res.status(200).json(rows);
            }
        );
    } else {
        db.all(
            `SELECT * FROM feedback_usuario WHERE usuario_id = ? ORDER BY data_feedback DESC`,
            [req.user.id],
            (err, rows) => {
                if (err) {
                    console.error('Erro ao buscar feedbacks:', err);
                    return res.status(500).json({ error: 'Erro ao buscar feedbacks' });
                }
                res.status(200).json(rows);
            }
        );
    }
};
 
exports.obterFeedbackPorId = (req, res) => {
    const { id } = req.params;
 
    db.get(
        "SELECT * FROM feedback_usuario WHERE feedback_id = ?",
        [id],
        (err, row) => {
            if (err) {
                console.error('Erro ao buscar feedback:', err);
                return res.status(500).json({ error: 'Erro ao buscar feedback' });
            }
            if (row) {
                res.status(200).json(row);
            } else {
                res.status(404).json({ error: 'Feedback não encontrado' });
            }
        }
    );
};
 
exports.atualizarFeedback = (req, res) => {
    const { id } = req.params;
    const { mensagem } = req.body;
 
    if (!mensagem || mensagem.trim() === '') {
        return res.status(400).json({ error: 'Mensagem do feedback é obrigatória' });
    }
 
    db.run(
        "UPDATE feedback_usuario SET mensagem = ? WHERE feedback_id = ? AND usuario_id = ?",
        [mensagem, id, req.user.id],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar feedback:', err);
                return res.status(500).json({ error: 'Erro ao atualizar feedback' });
            }
 
            if (this.changes) {
                res.status(200).json({ message: 'Feedback atualizado com sucesso!' });
            } else {
                res.status(404).json({ error: 'Feedback não encontrado' });
            }
        }
    );
};
 
exports.deletarFeedback = (req, res) => {
    const { id } = req.params;
 
    db.run(
        "DELETE FROM feedback_usuario WHERE feedback_id = ? AND usuario_id = ?",
        [id, req.user.id],
        function (err) {
            if (err) {
                console.error('Erro ao deletar feedback:', err);
                return res.status(500).json({ error: 'Erro ao deletar feedback' });
            }
 
            if (this.changes) {
                res.status(200).json({ message: 'Feedback deletado com sucesso!' });
            } else {
                res.status(404).json({ error: 'Feedback não encontrado' });
            }
        }
    );
};
 
exports.atualizarStatusFeedback = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
 
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem atualizar o status do feedback' });
    }
 
    if (!['pendente', 'aprovado', 'reprovado'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido. Use: pendente, aprovado ou reprovado' });
    }
 
    db.run(
        "UPDATE feedback_usuario SET status = ? WHERE feedback_id = ?",
        [status, id],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar status do feedback:', err);
                return res.status(500).json({ error: 'Erro ao atualizar status do feedback' });
            }
 
            if (this.changes) {
                res.status(200).json({ message: 'Status atualizado com sucesso!' });
            } else {
                res.status(404).json({ error: 'Feedback não encontrado' });
            }
        }
    );
};
 
exports.debugFeedbacks = (req, res) => {
    db.all("SELECT * FROM feedback_usuario", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar feedbacks:', err);
            return res.status(500).json({ error: 'Erro ao buscar feedbacks' });
        }
        res.json({
            total: rows.length,
            feedbacks: rows
        });
    });
};