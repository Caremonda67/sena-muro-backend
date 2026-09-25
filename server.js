const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Log de solicitudes en consola (para que los estudiantes vean las peticiones en vivo)
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ====================================================================
// CONFIGURACIÓN DE BASE DE DATOS (Híbrida: PostgreSQL o Local)
// ====================================================================
let pool = null;
const isPostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

if (isPostgres) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Permite conexión SSL requerida por Supabase / Neon / Render
  });
  console.log('🐘 Conectado a PostgreSQL en la nube (Supabase/Neon)');
} else {
  console.log('📁 Modo Local: No se detectó DATABASE_URL. Usando archivo local (local_db.json).');
}

// Ruta del archivo local en caso de no usar PostgreSQL
const LOCAL_DB_PATH = path.join(__dirname, 'local_db.json');

// Inicializar archivo local si no existe
function initLocalDb() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialData = {
      configuracion: {
        nombreMuro: 'Muro Digital del Salón',
        tema: 'ocean',
        emoji: '💬',
        descripcion: 'Envía un mensaje para poner a prueba la conexión en tiempo real entre Frontend, Backend y Base de Datos.'
      },
      mensajes: [
        {
          id: 1,
          autor: 'Instructor SENA',
          mensaje: '¡Bienvenidos al Muro Digital! Si estás viendo esto en tu navegador, tu Backend y Base de Datos están conectados con éxito. 🎉',
          fecha: new Date().toISOString()
        },
        {
          id: 2,
          autor: 'Aprendiz SENA',
          mensaje: 'Probando la conexión entre Frontend, Backend y Base de Datos. 🚀',
          fecha: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        }
      ]
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Métodos de base de datos unificados
function leerDbLocal() {
  initLocalDb();
  const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
  let data = JSON.parse(raw);
  if (Array.isArray(data)) {
    data = {
      configuracion: {
        nombreMuro: 'Muro Digital del Salón',
        tema: 'ocean',
        emoji: '💬',
        descripcion: 'Envía un mensaje para poner a prueba la conexión en tiempo real.'
      },
      mensajes: data
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }
  if (!data.configuracion) {
    data.configuracion = {
      nombreMuro: 'Muro Digital del Salón',
      tema: 'ocean',
      emoji: '💬',
      descripcion: 'Envía un mensaje para poner a prueba la conexión en tiempo real.'
    };
  }
  if (!Array.isArray(data.mensajes)) {
    data.mensajes = [];
  }
  return data;
}

function escribirDbLocal(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function obtenerConfiguracion() {
  if (isPostgres) {
    const res = await pool.query('SELECT nombre_muro, tema, emoji, descripcion FROM configuracion WHERE id = 1');
    if (res.rows.length > 0) {
      const r = res.rows[0];
      return {
        nombreMuro: r.nombre_muro,
        tema: r.tema,
        emoji: r.emoji,
        descripcion: r.descripcion
      };
    }
    return {
      nombreMuro: 'Muro Digital del Salón',
      tema: 'ocean',
      emoji: '💬',
      descripcion: 'Envía un mensaje para poner a prueba la conexión en tiempo real.'
    };
  } else {
    const data = leerDbLocal();
    return data.configuracion;
  }
}

async function guardarConfiguracion(config) {
  const { nombreMuro, tema, emoji, descripcion } = config;
  if (isPostgres) {
    await pool.query(
      `INSERT INTO configuracion (id, nombre_muro, tema, emoji, descripcion)
       VALUES (1, $1, $2, $3, $4)
       ON CONFLICT (id) 
       DO UPDATE SET nombre_muro = $1, tema = $2, emoji = $3, descripcion = $4`,
      [nombreMuro, tema, emoji, descripcion]
    );
    return config;
  } else {
    const data = leerDbLocal();
    data.configuracion = {
      nombreMuro: nombreMuro || 'Muro Digital del Salón',
      tema: tema || 'ocean',
      emoji: emoji || '💬',
      descripcion: descripcion || ''
    };
    escribirDbLocal(data);
    return data.configuracion;
  }
}

async function obtenerMensajes() {
  if (isPostgres) {
    const res = await pool.query('SELECT * FROM mensajes ORDER BY id DESC');
    return res.rows;
  } else {
    const data = leerDbLocal();
    return data.mensajes.sort((a, b) => b.id - a.id);
  }
}

async function guardarMensaje(autor, mensaje, imagenUrl = null) {
  if (isPostgres) {
    const res = await pool.query(
      'INSERT INTO mensajes (autor, mensaje, imagen_url, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [autor, mensaje, imagenUrl]
    );
    return res.rows[0];
  } else {
    const data = leerDbLocal();
    const nuevo = {
      id: data.mensajes.length > 0 ? Math.max(...data.mensajes.map(m => m.id)) + 1 : 1,
      autor: autor.trim(),
      mensaje: mensaje.trim(),
      imagen_url: imagenUrl ? imagenUrl.trim() : null,
      likes: 0,
      fecha: new Date().toISOString()
    };
    data.mensajes.push(nuevo);
    escribirDbLocal(data);
    return nuevo;
  }
}

async function darLike(id) {
  const numId = parseInt(id, 10);
  if (isPostgres) {
    const res = await pool.query(
      'UPDATE mensajes SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *',
      [numId]
    );
    return res.rows[0];
  } else {
    const data = leerDbLocal();
    const index = data.mensajes.findIndex(m => m.id === numId);
    if (index === -1) return null;
    data.mensajes[index].likes = (data.mensajes[index].likes || 0) + 1;
    escribirDbLocal(data);
    return data.mensajes[index];
  }
}

async function eliminarMensaje(id) {
  const numId = parseInt(id, 10);
  if (isPostgres) {
    const res = await pool.query('DELETE FROM mensajes WHERE id = $1 RETURNING *', [numId]);
    return res.rows[0] || null;
  } else {
    const data = leerDbLocal();
    const index = data.mensajes.findIndex(m => m.id === numId);
    if (index === -1) return null;
    const [eliminado] = data.mensajes.splice(index, 1);
    escribirDbLocal(data);
    return eliminado;
  }
}

// ====================================================================
// RUTAS DE LA API (Endpoints)
// ====================================================================

// 1. Ruta de prueba de salud (Health check)
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    mensaje: 'Servidor del Muro Digital SENA activo y listo 🚀',
    modoBaseDeDatos: isPostgres ? 'PostgreSQL (Nube)' : 'Local JSON (Pruebas)'
  });
});

// 2. Obtener lista de mensajes (GET)
app.get('/mensajes', async (req, res) => {
  try {
    const mensajes = await obtenerMensajes();
    res.json(mensajes);
  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ error: 'No se pudieron cargar los mensajes' });
  }
});

// 3. Crear un nuevo mensaje (POST)
app.post('/mensajes', async (req, res) => {
  try {
    const { autor, mensaje, imagenUrl } = req.body;

    if (!autor || !mensaje || !autor.trim() || !mensaje.trim()) {
      return res.status(400).json({ error: 'El autor y el mensaje son obligatorios' });
    }

    const nuevoMensaje = await guardarMensaje(autor, mensaje, imagenUrl);
    console.log(`✅ Nuevo mensaje registrado de [${nuevoMensaje.autor}]: "${nuevoMensaje.mensaje}"`);
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error);
    res.status(500).json({ error: 'No se pudo guardar el mensaje' });
  }
});

// 4. Dar Like a un mensaje (POST /mensajes/:id/like)
app.post('/mensajes/:id/like', async (req, res) => {
  try {
    const mensajeActualizado = await darLike(req.params.id);
    if (!mensajeActualizado) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    res.json({ id: mensajeActualizado.id, likes: mensajeActualizado.likes });
  } catch (error) {
    console.error('❌ Error al dar like:', error);
    res.status(500).json({ error: 'No se pudo procesar el like' });
  }
});

// 5. Eliminar un mensaje (DELETE /mensajes/:id)
app.delete('/mensajes/:id', async (req, res) => {
  try {
    const mensajeEliminado = await eliminarMensaje(req.params.id);
    if (!mensajeEliminado) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    console.log(`🗑️ Mensaje eliminado [ID: ${req.params.id}]`);
    res.json({ success: true, id: mensajeEliminado.id });
  } catch (error) {
    console.error('❌ Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'No se pudo eliminar el mensaje' });
  }
});

// 4. Obtener configuración del muro (GET)
app.get('/config', async (req, res) => {
  try {
    const config = await obtenerConfiguracion();
    res.json(config);
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error);
    res.status(500).json({ error: 'No se pudo obtener la configuración' });
  }
});

// 5. Guardar configuración del muro (POST)
app.post('/config', async (req, res) => {
  try {
    const { nombreMuro, tema, emoji, descripcion } = req.body;
    const configGuardada = await guardarConfiguracion({
      nombreMuro: nombreMuro || 'Muro Digital del Salón',
      tema: tema || 'ocean',
      emoji: emoji || '💬',
      descripcion: descripcion || ''
    });
    console.log(`🎨 Configuración actualizada: [${configGuardada.nombreMuro}] Tema: ${configGuardada.tema}`);
    res.json(configGuardada);
  } catch (error) {
    console.error('❌ Error al guardar configuración:', error);
    res.status(500).json({ error: 'No se pudo guardar la configuración' });
  }
});

// ====================================================================
// INICIO DEL SERVIDOR
// ====================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${isPostgres ? '🐘 PostgreSQL Nube' : '📁 Local (local_db.json)'}`);
  console.log('====================================================');
});
