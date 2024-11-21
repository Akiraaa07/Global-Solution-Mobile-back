const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({ error: "Nenhum token fornecido!" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    jwt.verify(token, "chave-secreta", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido!" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

module.exports = authMiddleware;
