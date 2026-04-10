# Guía de contribución

Gracias por tu interés en mejorar **FinanceHub Beta**.

## 🎯 Objetivo

Mantener una base de código clara, consistente y enfocada en mejorar la experiencia de finanzas personales para cada usuario.

## ✅ Antes de contribuir

1. Revisa si ya existe un issue relacionado.
2. Si vas a corregir un bug o proponer una mejora, abre o comenta un issue primero.
3. Asegúrate de trabajar sobre una rama nueva a partir de `main`.

## 🌱 Flujo recomendado

1. Haz un fork del repositorio.
2. Crea una rama descriptiva:
   - `feat/nombre-corto`
   - `fix/nombre-corto`
   - `docs/nombre-corto`
3. Instala dependencias:

```bash
npm install
```

1. Configura las variables de entorno y la base de datos.
1. Realiza cambios pequeños y enfocados.
1. Verifica que el proyecto siga compilando:

```bash
npx tsc --noEmit
npm run lint
```

## 🧭 Convenciones del proyecto

- Usa `TypeScript` con tipado claro.
- Mantén los componentes simples y reutilizables.
- Respeta el estilo existente de `Next.js App Router`.
- Prioriza accesibilidad, responsive design y claridad visual.
- Evita mezclar cambios no relacionados en un mismo pull request.

## 🧪 Verificación mínima antes de abrir PR

- [ ] El cambio resuelve un problema real o mejora una parte específica.
- [ ] El código compila correctamente.
- [ ] No introduce errores visibles en la UI.
- [ ] La documentación se actualizó si era necesario.
- [ ] El PR incluye una descripción breve y clara.

## 🐞 Reporte de bugs

Si detectas un error, repórtalo en:

- <https://github.com/sergiostebanpgx/financehub/issues>

Incluye, si es posible:

- pasos para reproducirlo,
- comportamiento esperado,
- comportamiento actual,
- capturas de pantalla o logs.

## 💡 Propuestas de mejora

Las ideas para UX, rendimiento, accesibilidad, seguridad o documentación son bienvenidas.

## 📄 Licencia

Al contribuir a este proyecto, aceptas que tus aportes se publiquen bajo la licencia del repositorio.
