# Cómo implementar tu Landing Page en tu Hosting y Railway

He actualizado la landing page para que ahora recopile los datos del cliente (nombre, dirección, email, teléfono) antes de redirigir a PayPal. También he creado un backend en Node.js que guarda la información en tu base de datos y te envía un correo a `sales@4puppies.cl`.

## 1. Configuración del Backend

En la carpeta `backend`, encontrarás un archivo `.env.example`. Debes crear un archivo `.env` (o configurar estas variables en Railway) con tus datos:

- `DATABASE_URL`: Tu cadena de conexión a PostgreSQL de Railway.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Los datos de tu servidor de correo para que el sistema pueda enviar notificaciones.

## 2. Implementación en Railway

Railway es ideal para alojar el backend y el frontend juntos.

1. **Sube tu código a GitHub**: Asegúrate de incluir tanto la raíz del proyecto como la carpeta `backend`.
2. **Crea un nuevo proyecto en Railway**: Conecta tu repositorio de GitHub.
3. **Configura las Variables de Entorno**: En la pestaña "Variables" de tu servicio en Railway, añade todas las variables del archivo `.env.example`.
4. **Comando de Inicio**: Railway detectará automáticamente el `package.json`. Asegúrate de que el comando de construcción sea `npm run build` y el de inicio sea `node backend/server.js`.

## 3. Preparación para Producción

Para que todo funcione correctamente, primero debes construir (build) el frontend:

```bash
npm run build
```

Esto generará una carpeta `dist`. El servidor en `backend/server.js` está configurado para servir automáticamente los archivos de esa carpeta cuando `NODE_ENV` es `production`.

## 4. Estructura de la Base de Datos

El servidor creará automáticamente la tabla `orders` la primera vez que se conecte a tu base de datos de Railway. Los campos que guardará son:
- Nombre del cliente
- Dirección (USA)
- Email y Teléfono
- Nombre y número de la mascota
- Talla y modelo de camiseta
- Total pagado

## 5. Correo de Ventas

Cada vez que alguien haga clic en "Proceed to PayPal", recibirás un correo en `sales@4puppies.cl` con todos estos detalles, incluso si el cliente decide no completar el pago en PayPal al final (esto te sirve como recuperación de carritos abandonados).

---

> [!TIP]
> Si usas Gmail para el SMTP, recuerda que debes generar una **Contraseña de Aplicación** (App Password) en tu cuenta de Google, ya que no permite usar tu contraseña normal por seguridad.

> [!IMPORTANT]
> He configurado el botón de PayPal con tu correo personal `vikingos82@hotmail.com`. Puedes cambiarlo en `src/App.tsx` si prefieres usar otro.
