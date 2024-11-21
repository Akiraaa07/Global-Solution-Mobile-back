const express = require('express');
const router = express.Router();
const aparelhosController = require('../controllers/aparelhosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de autenticação
router.use(authMiddleware);

// Rotas para CRUD de aparelhos
router.post('/', aparelhosController.cadastrarAparelho);
router.get('/', aparelhosController.listarAparelhos);
router.get('/:id', aparelhosController.obterAparelhoPorId);
router.put('/:id', aparelhosController.atualizarAparelho);
router.delete('/:id', aparelhosController.deletarAparelho);

// Rota para atualizar status do aparelho
router.patch('/:id/status', aparelhosController.atualizarStatusAparelho);

module.exports = router;