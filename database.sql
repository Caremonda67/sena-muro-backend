-- ============================================================
-- SCRIPT DE BASE DE DATOS: Muro Digital
-- Compatible con: Supabase, Neon, PostgreSQL y Render Postgres
-- ============================================================

-- 1. Crear la tabla de mensajes (con soporte para Likes e Imágenes)
CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  autor VARCHAR(60) NOT NULL,
  mensaje TEXT NOT NULL,
  imagen_url TEXT DEFAULT NULL,
  likes INT DEFAULT 0,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Si la tabla ya existía, añadir las columnas de forma segura
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT NULL;
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;

-- 2. Crear la tabla de configuración visual del muro
CREATE TABLE IF NOT EXISTS configuracion (
  id INT PRIMARY KEY DEFAULT 1,
  nombre_muro VARCHAR(100) DEFAULT 'Muro Digital del Salón',
  tema VARCHAR(30) DEFAULT 'ocean',
  emoji VARCHAR(10) DEFAULT '💬',
  descripcion TEXT DEFAULT 'Envía un mensaje para poner a prueba la conexión en tiempo real.'
);

-- Insertar configuración por defecto si no existe
INSERT INTO configuracion (id, nombre_muro, tema, emoji, descripcion)
VALUES (1, 'Muro Digital del Salón', 'ocean', '💬', 'Envía un mensaje para poner a prueba la conexión en tiempo real.')
ON CONFLICT (id) DO NOTHING;

-- 3. Mensajes de ejemplo con imágenes y likes
INSERT INTO mensajes (autor, mensaje, imagen_url, likes) VALUES 
('Instructor SENA', '¡Bienvenidos al Muro Digital! Si estás viendo este mensaje, la base de datos está conectada con éxito. 🎉', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 5),
('Aprendiz 1', '¡Hola mundo desde la web! Saludos a todos los compañeros.', NULL, 2);
