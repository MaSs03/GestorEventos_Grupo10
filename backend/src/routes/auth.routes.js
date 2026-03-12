const router = require("express").Router();
const { register, login, registerAdmin, resetAdminPassword } = require("../controllers/auth.controller");


router.post("/register", register);
router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.post("/reset-admin-password", resetAdminPassword);

module.exports = router;