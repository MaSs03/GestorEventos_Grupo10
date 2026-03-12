const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const { dashboard } = require("../controllers/admin.controller");

router.get("/dashboard", auth, requireRole("ADMIN"), dashboard);

module.exports = router;
