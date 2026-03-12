const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const {
  inscribir,
  cancelar,
  misInscripciones,
  inscritosPorEvento,
} = require("../controllers/inscripciones.controller");

// CLIENTE
router.get("/mis-inscripciones", auth, requireRole("CLIENTE"), misInscripciones);
router.post("/:eventoId", auth, requireRole("CLIENTE"), inscribir);
router.delete("/:eventoId", auth, requireRole("CLIENTE"), cancelar);

// ADMIN (ver inscritos por evento)
router.get("/evento/:eventoId", auth, requireRole("ADMIN"), inscritosPorEvento);

module.exports = router;
