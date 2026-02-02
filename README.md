# Barber Flow AI Showcase 💈

Un sistema moderno de reservas y gestión para barberías, construido con Next.js 14, Supabase y Tailwind CSS.

## Características Principales

### 📱 Para el Cliente (Landing Page)
- **Diseño Premium**: Interfaz oscura y elegante.
- **Reserva Inteligente**:
  - Selección de Servicios (Corte, Barba, etc.) con precios actualizados.
  - Disponibilidad Real: Solo muestra horarios libres entre 9:00 y 20:00.
  - Bloqueo de turnos ya ocupados.

### 🛠️ Para el Barbero (Dashboard)
- **Panel de Control**: Acceso seguro con email/contraseña.
- **KPIs en Tiempo Real**: Visualiza ingresos estimados, total de citas y métricas de crecimiento.
- **Gráficos**: Histórico de actividad semanal.
- **Gestión de Citas**: Ver listado, confirmar asistencia o cancelar turnos.
- **Gestión de Servicios**: Crear, editar y eliminar servicios (precios, duración) sin tocar código.

## Configuración del Proyecto

### 1. Variables de Entorno
Asegúrate de tener un archivo `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 2. Base de Datos
Ejecuta los scripts SQL en el Editor SQL de Supabase para crear las tablas necesarias:
1. `supabase/schema.sql`: Estructura base (citas y servicios).
2. `supabase/migration_fix.sql`: Correcciones y actualizaciones (si tienes errores de columnas faltantes).

### 3. Instalación y Ejecución
```bash
npm install
npm run dev
```
Visita `http://localhost:3000` para ver la aplicación.

## Estructura del Proyecto
- `/app`: Rutas de Next.js (Home, Login, Dashboard).
- `/components`: Componentes reutilizables UI (formulario, tablas, tarjetas).
- `/lib/supabase`: Cliente y middleware de conexión a base de datos.
- `/supabase`: Scripts SQL para la base de datos.

## 🤖 Configuración del Asistente de WhatsApp (IA)

Este proyecto incluye un asistente de inteligencia artificial capaz de agendar citas y verificar disponibilidad vía WhatsApp.

### 1. Variables de Entorno Adicionales
Añade estas claves a tu archivo `.env.local`:

```env
# Clave maestra de Supabase (NECESARIA para que la IA consulte/guarde datos sin restricciones)
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_de_supabase

# Configuración de Google Gemini (IA Gratuita)
# Consigue tu key aquí: https://aistudio.google.com/
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_google

# Configuración de Twilio (WhatsApp Webhook)
# Regístrate gratis en: https://www.twilio.com/
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=tu_numero_sandbox (ej: +14155238886)
```

### 2. Conectar WhatsApp con tu Código
Para que Twilio hable con tu computadora (localhost), necesitas exponer tu servidor o desplegarlo.

#### Opción A: Despliegue en Vercel (Recomendado)
1. Despliega tu proyecto en Vercel.
2. Ve a la consola de Twilio -> Messaging -> Sandbox settings.
3. En "When a message comes in", pega la URL de tu despliegue:
   `https://tu-proyecto.vercel.app/api/whatsapp`

#### Opción B: Pruebas Locales (ngrok)
1. Instala [ngrok](https://ngrok.com/).
2. Ejecuta en tu terminal: `ngrok http 3000`
3. Copia la URL que te da (ej: `https://a1b2c3d4.ngrok-free.app`).
4. Ve a la consola de Twilio -> Messaging -> Sandbox settings.
5. Pega la URL terminada en el endpoint:
   `https://a1b2c3d4.ngrok-free.app/api/whatsapp`
