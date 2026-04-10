# FinanceHub Beta

![Logo de FinanceHub](public/logo.png)

Aplicación web para administrar ingresos, gastos, categorías, metas de ahorro y deudas personales desde una sola interfaz.

[Demo](https://financehub-nemeziz.vercel.app) · [Reportar bugs](https://github.com/sergiostebanpgx/financehub/issues)

---

## 📌 Descripción

**FinanceHub Beta** es una plataforma de finanzas personales construida con `Next.js 16`, `Prisma` y `PostgreSQL`.
Permite registrar movimientos financieros, organizar categorías por usuario, dar seguimiento a metas y deudas, y administrar la cuenta desde un panel moderno y responsive.

---

## ✨ Funcionalidades principales

- 🔐 **Autenticación por credenciales** con `Auth.js`
- 📊 **Dashboard financiero** con balance, ingresos, gastos y resumen mensual
- 🧾 **Gestión de transacciones** por categoría
- 🗂️ **Categorías personalizadas por usuario**
- 🎯 **Metas de ahorro** con progreso y aportes rápidos
- 💳 **Seguimiento de deudas** con resumen acumulado y abonos
- ⚙️ **Ajustes de perfil y seguridad**
- 🗑️ **Eliminación segura de cuenta** con confirmación explícita
- 📱 **Diseño responsive** y soporte tipo **PWA**
- 🌐 **SEO + Open Graph** configurado para compartir en redes sociales

> Nota: el registro por OTP está **temporalmente desactivado** para la creación de cuenta. El flujo actual de alta funciona con registro directo + login automático.

---

## 🧱 Stack técnico

| Capa | Tecnología |
| ---- | ---------- |
| Frontend | `Next.js 16` + `React 19` + `Tailwind CSS v4` |
| Backend | Route Handlers de Next.js |
| Base de datos | `PostgreSQL` (Neon recomendado) |
| ORM | `Prisma` |
| Autenticación | `Auth.js / NextAuth` |
| Email | `Resend` |
| Deploy | `Vercel` |

---

## 🗂️ Estructura del proyecto

```txt
src/
  app/
    (auth)/          # Login y registro
    ajustes/         # Configuración de cuenta
    categorias/      # Gestión de categorías
    api/             # Endpoints HTTP
    manifest.ts      # Configuración PWA
    opengraph-image.tsx
    robots.ts
    sitemap.ts
  components/        # Componentes UI y de negocio
  lib/               # Auth, Prisma, helpers, validaciones
  types/
prisma/
  schema.prisma
  seed.ts
public/
```

---

## 🚀 Puesta en marcha local

### 1) Instalar dependencias

```bash
npm install
```

### 2) Crear variables de entorno

Crea un archivo `.env` o `.env.local` con valores similares a estos:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
AUTH_SECRET="tu-secreto-seguro"
NEXTAUTH_SECRET="tu-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
RESEND_API_KEY=""
RESEND_FROM="onboarding@resend.dev"
```

### 3) Preparar la base de datos

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4) Ejecutar en desarrollo

```bash
npm run dev
```

Aplicación local: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variables de entorno

| Variable | Requerida | Descripción |
| -------- | --------- | ----------- |
| `DATABASE_URL` | Sí | Conexión a PostgreSQL |
| `AUTH_SECRET` | Sí | Secreto principal de Auth.js |
| `NEXTAUTH_SECRET` | Sí | Secreto para sesión JWT |
| `NEXTAUTH_URL` | Recomendado | URL pública de la app |
| `AUTH_TRUST_HOST` | Recomendado | `true` en entornos detrás de proxy |
| `RESEND_API_KEY` | Opcional | Necesaria si activas envíos OTP por correo |
| `RESEND_FROM` | Opcional | Remitente validado para Resend |

---

## 🧪 Scripts útiles

```bash
npm run dev         # Ejecuta la app en desarrollo
npm run build       # Build de producción
npm run start       # Corre la build localmente
npm run lint        # Lint del proyecto
npm run db:generate # Genera cliente Prisma
npm run db:migrate  # Ejecuta migraciones en desarrollo
npm run db:seed     # Inserta datos iniciales
npm run db:up       # Levanta servicios con Docker Compose
npm run db:down     # Baja servicios Docker
```

---

## 👤 Modelo funcional actual

- Las **categorías son por usuario** y no se comparten globalmente.
- Cada cuenta tiene sus propios:
  - movimientos
  - categorías
  - metas
  - deudas
- La eliminación de cuenta borra también todos los registros asociados.

---

## 🌍 SEO y social preview

La aplicación ya incluye:

- `title` y `description` globales
- `keywords`
- etiquetas **Open Graph**
- `robots.ts`
- `sitemap.ts`
- imagen social generada en `src/app/opengraph-image.tsx`

Dominio configurado actualmente:

```txt
https://financehub-nemeziz.vercel.app
```

---

## ☁️ Despliegue en Vercel

### Opción 1: importar repositorio

1. Sube el código a GitHub.
1. En Vercel, crea un nuevo proyecto e importa el repositorio.
1. Configura las variables de entorno.
1. Ejecuta el primer deploy.

### Opción 2: botón de despliegue

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sergiostebanpgx/financehub)

---

## 🐞 Reporte de errores

Si encuentras un bug o quieres proponer una mejora, usa el tablero de issues:

- GitHub Issues: <https://github.com/sergiostebanpgx/financehub/issues>

---

## 🤝 Guía de contribución

Si quieres colaborar con mejoras, documentación o correcciones:

1. Revisa la guía en [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. Crea una rama específica para tu cambio.
3. Verifica `npx tsc --noEmit` y `npm run lint` antes de abrir el PR.
4. Describe claramente el objetivo y alcance de tu aporte.

---

## ⚖️ Licencia

Este proyecto se distribuye bajo la licencia [`MIT`](LICENSE).

---

## ⚠️ Troubleshooting

### Error `EPERM` con Prisma en Windows durante build

Si `npm run build` falla con un error similar a este:

```txt
EPERM: operation not permitted, rename ...query_engine-windows.dll.node...
```

Prueba lo siguiente:

1. Cierra procesos de `Next.js`, Node o VS Code que puedan estar usando Prisma.
1. Ejecuta de nuevo:

```bash
npm run db:generate
npm run build
```

1. Si persiste, reinicia la terminal o el sistema y vuelve a intentar.

---

## 📄 Estado del proyecto

**FinanceHub** se encuentra en fase **Beta**.
La aplicación ya cuenta con funcionalidades base operativas, pero sigue recibiendo mejoras de UX, seguridad, SEO y documentación.

---

## 📬 Autor

Desarrollado por **Sergio Steban Parra Guarnizo**. <https://sergiostebanpgx.vercel.app/>

Si quieres seguir evolucionando el proyecto, este README queda preparado para crecer con nuevas secciones como roadmap, contribución, changelog y documentación técnica avanzada.
