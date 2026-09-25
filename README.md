# 🚀 Muro Digital - Backend API (SENA)

API REST en Node.js y Express para la actividad de despliegue en la nube y bases de datos.

## 🛠️ Tecnologías
- **Node.js** + **Express**
- **PostgreSQL** (`pg`) con SSL para Supabase / Neon / Render
- **CORS** habilitado

---

## ☁️ Despliegue en Render (Paso a Paso)

1. Haz clic en **Fork** (arriba a la derecha) para tener tu propia copia de este repositorio.
2. Inicia sesión en [Render.com](https://render.com).
3. Haz clic en **New +** ➔ **Web Service**.
4. Conecta tu cuenta de GitHub y selecciona tu repositorio `sena-muro-backend`.
5. Configura los siguientes campos:
   - **Name:** `muro-backend-tu-nombre` (ej: `muro-backend-carlos`)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
6. En la sección **Environment Variables** (Variables de Entorno), agrega:
   - **Key:** `DATABASE_URL`
   - **Value:** *(Pega aquí la cadena de conexión de tu base de datos de Supabase o Neon)*
7. Haz clic en **Deploy Web Service**.
8. Una vez terminado el despliegue, Render te dará una URL pública con HTTPS (ejemplo: `https://muro-backend-carlos.onrender.com`). **¡Copia esa URL para usarla en tu Frontend!**

---

## 🗄️ Inicializar la Base de Datos (SQL)
Si estás usando Supabase o Neon, ve a la sección **SQL Editor**, copia el contenido del archivo `database.sql` y ejecútalo para crear las tablas necesarias.
