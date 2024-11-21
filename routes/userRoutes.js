const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas de autenticação (não protegidas)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Middleware de autenticação para proteger rotas de usuários
router.use(authMiddleware);

// Rotas CRUD para usuários (protegidas)
router.get('/usuarios', userController.getUsers);
router.get('/usuarios/:id', userController.getUserById);
router.put('/usuarios/:id', userController.updateUser);
router.delete('/usuarios/:id', userController.deleteUser);

module.exports = router;
