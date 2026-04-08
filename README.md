<div align="center">
  <img src="public/logo.png" alt="FinanceHub logo" width="140" />
  <h1>FinanceHub</h1>
  <p>
    Aplicacion web moderna para administrar ingresos, gastos, metas de ahorro y deudas.
  </p>
  <p>
    <a href="https://nextjs.org/">Next.js 16</a> ·
    <a href="https://www.prisma.io/">Prisma</a> ·
    <a href="https://neon.tech/">Neon PostgreSQL</a> ·
    <a href="https://authjs.dev/">Auth.js</a> ·
    <a href="https://vercel.com/">Vercel</a>
  </p>
</div>

## Resumen
FinanceHub es una plataforma de finanzas personales con autenticacion por credenciales, dashboard interactivo y gestion completa de movimientos.

### Funcionalidades principales
- Registro e inicio de sesion.
- Dashboard con balance, ingresos, gastos y tendencia mensual.
- Gestion de transacciones por categoria.
- Gestion de categorias personalizadas.
- Metas de ahorro y seguimiento de deudas.
- Ajustes de perfil y cambio de contrasena con OTP por correo.
- Interfaz responsive + instalable como PWA.

## Stack tecnico
- **Frontend**: Next.js App Router + React 19 + Tailwind CSS v4.
- **Backend**: Route Handlers de Next.js.
- **Base de datos**: PostgreSQL (Neon) + Prisma ORM.
- **Autenticacion**: Auth.js (NextAuth, estrategia JWT).
- **Email**: Resend.

## Estructura del proyecto
```txt
src/
  app/
    (auth)/
    api/
    ajustes/
    categorias/
  components/
  lib/
prisma/
public/
```

## Configuracion local
### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
Copy-Item .env.example .env
```

Completa los valores reales en `.env`.

### 3. Base de datos y Prisma
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

App local: `http://localhost:3000`

## Variables de entorno
| Variable | Requerida | Descripcion |
|---|---|---|
| `DATABASE_URL` | Si | Conexion a PostgreSQL (Neon recomendado). |
| `AUTH_SECRET` | Si | Secreto principal de Auth.js. |
| `NEXTAUTH_SECRET` | Si | Mismo valor que `AUTH_SECRET`. |
| `AUTH_TRUST_HOST` | Si | `true` para despliegues tras proxy (Vercel). |
| `NEXTAUTH_URL` | Produccion | URL publica de la app. Ej: `https://financehub.vercel.app`. |
| `RESEND_API_KEY` | Si (OTP) | API key de Resend para enviar codigos. |
| `RESEND_FROM` | Si (OTP) | Remitente validado en Resend. |

## Scripts utiles
```bash
npm run dev        # Desarrollo
npm run build      # Build de produccion
npm run start      # Ejecutar build local
npm run lint       # ESLint
npm run db:up      # Levantar PostgreSQL local (Docker)
npm run db:down    # Apagar PostgreSQL local
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Despliegue en Vercel
Si, este proyecto se puede desplegar en Vercel.

### Opcion A: Importando el repositorio
1. Sube el codigo a GitHub.
2. En Vercel, selecciona **Add New Project** e importa `sergiostebanpgx/financehub`.
3. Configura las variables de entorno del `.env.example` en Vercel (Production/Preview).
4. Ejecuta un primer deploy.

### Opcion B: Boton de deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sergiostebanpgx/financehub)

## Seguridad y repo publico
- `.env` y cualquier `.env.*` estan excluidos en `.gitignore`.
- Solo se versiona `.env.example` con placeholders.
- Nunca subas API keys reales al repositorio.

## Estado del proyecto
- Build de produccion verificado localmente antes de publicar.
- Listo para publicarse en GitHub y conectar con Vercel.
