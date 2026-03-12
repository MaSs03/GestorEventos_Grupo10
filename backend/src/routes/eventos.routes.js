const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const {
  crearEvento,
  listarEventos,
  obtenerEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/eventos.controller");

// Público
router.get("/", listarEventos);
router.get("/:id", obtenerEvento);

// ADMIN
router.post("/", auth, requireRole("ADMIN"), crearEvento);
router.put("/:id", auth, requireRole("ADMIN"), actualizarEvento);
router.delete("/:id", auth, requireRole("ADMIN"), eliminarEvento);

module.exports = router;
