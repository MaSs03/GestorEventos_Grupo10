const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const eventosRoutes = require("./routes/eventos.routes");
const inscripcionesRoutes = require("./routes/inscripciones.routes");
const adminRoutes = require("./routes/admin.routes");
const recursosRoutes = require("./routes/recursos.routes");



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, msg: "API Gestión de Eventos" }));

app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recursos", recursosRoutes);



// 404
app.use((req, res) => res.status(404).json({ ok: false, msg: "Ruta no encontrada" }));

module.exports = app;
