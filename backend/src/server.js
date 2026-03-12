require("dotenv").config();
const app = require("./app");
const dbPromise = require("./config/db"); // <-- ahora es una promesa que inicializa DB

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Esperar a que la base de datos esté lista
    const db = await dbPromise;

    // Probar la conexión
    await db.query("SELECT 1");
    console.log("✅ Conectado a la base de datos");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar a la BD:", err.message);
    process.exit(1);
  }
}

start();
