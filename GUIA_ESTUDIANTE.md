# 📱 Muro Digital: Tu Primera Aplicación Web en la Nube
## 📖 Guía Paso a Paso para Aprendices (Sin experiencia previa)

¡Bienvenido! En este taller vas a construir y publicar en internet tu propia aplicación web en tiempo real llamada **Muro Digital**, la cual funcionará en computadores y teléfonos celulares.

No necesitas saber programación. Seguiremos una serie de pasos muy sencillos usando tres plataformas profesionales de la nube que ofrecen planes 100% gratuitos:
1. **Neon o Supabase:** Guardará los mensajes y fotos en una Base de Datos PostgreSQL.
2. **Render:** Alojará el "cerebro" o Backend de tu aplicación.
3. **Vercel:** Publicará tu página web (Frontend) con un enlace público `.vercel.app` para que cualquier persona en el mundo pueda entrar.

---

## 🗺️ Mapa de Ruta del Taller

```text
PASO 1: Base de Datos (Neon)  ➔  PASO 2: Backend (Render)  ➔  PASO 3: Frontend (Vercel)  ➔  PASO 4: ¡A Compartir!
```

---

## 🟢 PASO 1: Crear tu Base de Datos en la Nube (Neon)

La base de datos es la "bodega digital" donde se guardarán todos los mensajes, fotos y likes, incluso si apagas tu computador.

### 1.1. Crear cuenta en Neon
1. Abre tu navegador web y entra a: **[https://neon.tech](https://neon.tech)**
2. Haz clic en el botón superior derecho **"Sign Up"** (Registrarse).
3. Selecciona la opción **"Continue with GitHub"** (o con Google). Inicia sesión con tus credenciales.

### 1.2. Crear tu Proyecto de Base de Datos
1. Una vez dentro del panel de Neon, haz clic en el botón **"Create Project"** (o **"New Project"**).
2. Verás un formulario muy simple:
   - **Name:** Escribe `muro-sena` (o tu nombre).
   - **Postgres version:** Déjalo en la versión por defecto (16 o 17).
   - **Region:** Elige **US East (Ohio o N. Virginia)** para mayor velocidad en Colombia.
3. Haz clic en el botón verde **"Create Project"**.

### 1.3. Copiar la Cadena de Conexión (`DATABASE_URL`)
1. Inmediatamente se abrirá una ventana que dice **"Connection Details"**.
2. Asegúrate de que el desplegable diga **"Connection string"** y que la casilla **"Pooled connection"** esté seleccionada (o déjala por defecto).
3. Verás un texto largo que empieza por `postgresql://...`
4. Haz clic en el icono de **Copiar** 📋 (al lado del texto).
5. **¡MUY IMPORTANTE!** Abre el Bloc de Notas en tu computador y pega ese texto. Lo llamaremos tu **`DATABASE_URL`**. Lo usaremos en el Paso 2.

> [!TIP]
> Tu cadena se verá parecida a esto:
> `postgresql://neondb_owner:npg_AbCd123@ep-delicate-tree-44638767.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 1.4. Crear la Tabla de Mensajes (Ejecutar SQL)
1. En el menú lateral izquierdo de Neon, haz clic en **"SQL Editor"**.
2. En la pantalla grande en blanco, borra lo que haya y pega exactamente el siguiente código:

```sql
CREATE TABLE IF NOT EXISTS configuracion (
  id INT PRIMARY KEY DEFAULT 1,
  nombre_muro VARCHAR(100) DEFAULT 'Muro Digital del Salón',
  tema VARCHAR(50) DEFAULT 'ocean',
  emoji VARCHAR(10) DEFAULT '💬',
  descripcion VARCHAR(255) DEFAULT 'Envía un mensaje para poner a prueba la conexión en tiempo real.'
);

CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  autor VARCHAR(60) NOT NULL,
  mensaje TEXT NOT NULL,
  imagen_url TEXT DEFAULT NULL,
  likes INT DEFAULT 0,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO configuracion (id, nombre_muro, tema, emoji, descripcion)
VALUES (1, 'Muro Digital del Salón', 'ocean', '💬', 'Envía un mensaje para poner a prueba la conexión en tiempo real.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mensajes (autor, mensaje, imagen_url, likes) 
VALUES 
  ('Instructor SENA', '¡Bienvenidos al Muro Digital! Si estás viendo este mensaje, la base de datos está conectada con éxito. 🎉', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 5),
  ('Aprendiz 1', '¡Hola mundo desde la web! Saludos a todos los compañeros.', NULL, 2);
```

3. Haz clic en el botón verde **"Run"** (o presiona `Ctrl + Enter`).
4. **¡ATENCIÓN!** Haz clic en **"Run"**, **NO** en "Explain".
5. Abajo debe aparecer un mensaje verde que dice: **`Success`** o **`Query returned 0 rows`**.

¡Listo! Tu bodega de datos está creada y esperando mensajes.

---

## 🟣 PASO 2: Desplegar el Backend en Render

El backend es el "mesero" que recibe las peticiones de tu página web, procesa las imágenes y habla con la base de datos.

### 2.1. Crear tu copia del código en GitHub
1. Abre tu navegador e ingresa a este repositorio plantilla:
   👉 **[https://github.com/Caremonda67/sena-muro-backend](https://github.com/Caremonda67/sena-muro-backend)**
2. Inicia sesión en GitHub si no lo has hecho.
3. En la parte superior derecha, haz clic en el botón verde **"Use this template"** y selecciona **"Create a new repository"**.
4. Llena los datos:
   - **Repository name:** Escribe `mi-muro-backend`.
   - **Privacy:** Asegúrate de que esté en **Public**.
5. Haz clic en el botón verde **"Create repository"**.
6. ¡Ya tienes tu propio código del backend en tu cuenta de GitHub!

### 2.2. Conectar tu Backend a Render
1. Abre una nueva pestaña y entra a: **[https://render.com](https://render.com)**
2. Haz clic en **"Sign In"** o **"Get Started"** y elige **"GitHub"** para iniciar sesión con tu misma cuenta.
3. En tu panel de Render (Dashboard), haz clic en el botón azul superior **"+ New"** y selecciona **"Web Service"**.
4. Verás dos opciones:
   - Selecciona **"Build and deploy from a Git repository"** y haz clic en **"Next"**.
5. En la lista de repositorios, busca **`mi-muro-backend`** y haz clic en el botón **"Connect"** a la derecha.
   *(Si no aparece tu repositorio, haz clic abajo en "+ Configure GitHub App" para darle permiso a Render de ver tus repositorios de GitHub).*

### 2.3. Configurar el Web Service en Render
Llena exactamente los siguientes campos (los demás déjalos como están):
1. **Name:** Escribe `mi-muro-backend-tunombre` (debe ser en minúsculas y sin espacios, por ejemplo: `mi-muro-carlos`).
2. **Region:** Déjala en **Ohio (US East)** o **Oregon (US West)**.
3. **Branch:** Déjala en `main`.
4. **Runtime:** Selecciona **Node**.
5. **Build Command:** Debe decir exactamente: `npm install`
6. **Start Command:** Debe decir exactamente: `npm start`
7. **Instance Type:** Selecciona la opción **Free** ($0 / mes).

### 2.4. Agregar la Variable de Entorno (`DATABASE_URL`)
*Aquí es donde unimos el backend con la bodega de datos de Neon que creaste en el Paso 1.*

1. Desplázate hacia abajo hasta la sección llamada **"Environment Variables"** (o haz clic en "Advanced").
2. Haz clic en el botón **"Add Environment Variable"**.
3. Rellena los dos campos:
   - En la casilla **Key**: escribe exactamente: `DATABASE_URL` (en mayúsculas).
   - En la casilla **Value**: pega la cadena de conexión que guardaste en tu Bloc de Notas en el Paso 1.3 (la que empieza por `postgresql://...`).
4. Desplázate al final de la página y haz clic en el botón azul **"Deploy Web Service"** (o **"Create Web Service"**).

### 2.5. Esperar el Despliegue y Copiar tu URL
1. Render empezará a compilar tu aplicación. Verás una terminal negra con letras blancas.
2. Espera entre 1 y 2 minutos hasta que veas en letras verdes: **`==> Your service is live 🎉`**.
3. En la parte superior izquierda, debajo del nombre de tu servicio, verás tu enlace público que termina en `.onrender.com`.
   - Por ejemplo: `https://mi-muro-carlos.onrender.com`
4. Haz clic derecho sobre ese enlace y selecciona **"Copiar dirección de enlace"** (o ábrelo en una pestaña).
5. **¡MUY IMPORTANTE!** Pega este enlace en tu Bloc de Notas. Lo llamaremos tu **`URL_DEL_BACKEND`**.

> [!NOTE]
> Si abres ese enlace en tu navegador, deberías ver una respuesta como esta:
> `{"status":"OK","mensaje":"Servidor del Muro Digital SENA activo y listo 🚀","modoBaseDeDatos":"PostgreSQL (Nube)"}`
> Si ves esto, ¡tu backend y tu base de datos ya están conectados con éxito!

---

## ▲ PASO 3: Desplegar el Frontend en Vercel

El frontend es la cara visible de tu sitio web: los botones, colores, temas, stickers, código QR y formulario donde la gente escribe sus mensajes.

### 3.1. Crear tu copia del Frontend en GitHub
1. Abre tu navegador e ingresa a este repositorio plantilla:
   👉 **[https://github.com/Caremonda67/sena-muro-frontend](https://github.com/Caremonda67/sena-muro-frontend)**
2. Haz clic en el botón verde **"Use this template"** y selecciona **"Create a new repository"**.
3. Llena los datos:
   - **Repository name:** Escribe `mi-muro-frontend`.
   - **Privacy:** Asegúrate de que esté en **Public**.
4. Haz clic en **"Create repository"**.

### 3.2. Conectar tu Frontend con tu Backend de Render
*Solo debemos cambiar una línea en el archivo `script.js` para que tu página web sepa a cuál backend llamar.*

1. Dentro de tu nuevo repositorio `mi-muro-frontend` en GitHub, haz clic en el archivo llamado **`script.js`**.
2. En la parte superior derecha del archivo, haz clic en el icono de lápiz ✏️ (**"Edit this file"**).
3. Busca la **Línea 5**, que dice:
   ```javascript
   const DEFAULT_BACKEND_URL = "https://sena-muro-backend.onrender.com";
   ```
4. Reemplaza la URL entre comillas por **tu propia `URL_DEL_BACKEND`** que guardaste en el Paso 2.5:
   ```javascript
   const DEFAULT_BACKEND_URL = "https://mi-muro-carlos.onrender.com";
   ```
   *(Asegúrate de no borrar las comillas dobles `"` ni el punto y coma `;` al final, y no dejes barra diagonal `/` al final de la URL).*

5. Haz clic en el botón verde superior **"Commit changes..."** (Guardar cambios).
6. En la ventana que aparece, haz clic directamente en el botón verde **"Commit changes"**.

### 3.3. Desplegar en Vercel
1. Abre una pestaña y entra a: **[https://vercel.com](https://vercel.com)**
2. Haz clic en **"Sign Up"** o **"Log In"** y selecciona **"Continue with GitHub"**.
3. En tu panel de Vercel, haz clic en el botón negro **"Add New..."** y selecciona **"Project"**.
4. Verás una lista con tus repositorios de GitHub:
   - Busca el que se llama **`mi-muro-frontend`**.
   - Haz clic en el botón **"Import"** a su lado.
5. Aparecerá la pantalla de configuración:
   - **Project Name:** Déjalo como está o ponle el nombre que quieras.
   - **Framework Preset:** Déjalo en **"Other"**.
   - **Root Directory:** Déjalo como está (`./`).
   - *No necesitas cambiar nada más ni tocar variables de entorno aquí.*
6. Haz clic en el botón azul grande **"Deploy"**.
7. Espera unos 15 segundos mientras Vercel procesa tu web. Verás una lluvia de confeti 🎊 y el mensaje: **"Congratulations! You just deployed a new Project to Vercel."**
8. Haz clic en la captura de pantalla de tu web o en el botón **"Continue to Dashboard"** y luego en el enlace con dominio `.vercel.app`.

---

## 🎉 PASO 4: ¡Probar y Compartir tu Muro en Vivo!

¡Tu aplicación ya está en internet y es 100% tuya!

### 4.1. Verificaciones en Pantalla:
1. En la barra superior debes ver un punto verde brillante: **🟢 En línea (XXXms)**. Esto significa que tu Frontend (Vercel) se comunicó exitosamente con tu Backend (Render) y tu Base de Datos (Neon).
2. Debes ver los dos mensajes iniciales de prueba cargados desde la base de datos.

### 4.2. Ponlo a prueba:
1. **Publica un mensaje:** Escribe tu nombre, un saludo y sube una foto o GIF con el botón **📁 Subir Foto**.
2. **Dale Like (❤️):** Toca el corazón en cualquier mensaje y observa cómo el contador sube en tiempo real.
3. **Personaliza tu Muro:** Haz clic en el botón **🎨 Personalizar** en la barra superior. Elige un emoji, un tema de color (como *SENA*, *Galaxia*, *Cyberpunk* o *Candy*) y un lema. Haz clic en **Guardar y Aplicar ✨**.
4. **Ábrelo en tu Celular:**
   - Haz clic en el botón **📱 Código QR** en la barra superior.
   - Saca tu celular, abre la cámara y escanea el código.
   - ¡Tu muro se abrirá en tu celular con el mismo diseño, mensajes y tema que personalizaste!
5. **Comparte tu enlace:** Envía tu enlace `.vercel.app` al chat de la clase para que tus compañeros y tu instructor te dejen mensajes.

---

## 🛠️ Preguntas Frecuentes y Solución de Problemas para Aprendices

### 1. ¿Por qué la primera vez que abro la página se demora unos 40 segundos en cargar?
Las cuentas gratuitas de Render "duermen" el servidor si nadie lo usa durante 15 minutos para ahorrar energía. La primera persona que entra después de un rato lo "despierta". Una vez despierto, responderá a toda velocidad (~100 milisegundos).

### 2. En la barra superior me sale "⚠️ Desconectado" o "Sin conexión", ¿qué hago?
- Verifica que tu servicio en Render esté en estado **"Live"** (verde).
- Entra a tu URL de Render en una pestaña nueva (ej: `https://mi-muro-carlos.onrender.com/`). Si dice *"Not Found"*, revisa que hayas copiado bien la URL.
- Revisa el Paso 3.2: en `script.js` debiste pegar tu URL de Render sin espacios, con comillas y sin barra final `/`.

### 3. Al dar clic en "Publicar" me sale un error rojo
Verifica en Neon que hayas ejecutado el código SQL del Paso 1.4 con el botón verde **"Run"** para que existan las tablas donde se guardan los mensajes.

---
**¡Felicitaciones! Acabas de desplegar una aplicación web Full-Stack completa con Frontend, Backend y Base de Datos Relacional en la Nube.** 🚀
