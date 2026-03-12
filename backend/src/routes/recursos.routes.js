const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const {
  crearRecurso, listarRecursos, actualizarRecurso, eliminarRecurso,
  asignarRecursoEvento, recursosDeEvento
} = require("../controllers/recursos.controller");

// ADMIN recursos
router.get("/", auth, requireRole("ADMIN"), listarRecursos);
router.post("/", auth, requireRole("ADMIN"), crearRecurso);
router.put("/:id", auth, requireRole("ADMIN"), actualizarRecurso);
router.delete("/:id", auth, requireRole("ADMIN"), eliminarRecurso);

// ADMIN asignar a evento
router.post("/evento/:eventoId", auth, requireRole("ADMIN"), asignarRecursoEvento);
router.get("/evento/:eventoId", auth, recursosDeEvento);

module.exports = router;
