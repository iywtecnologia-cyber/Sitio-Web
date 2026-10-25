# Despliegue de TecnoRosario.AR en Render

El proyecto está 100% optimizado y listo para desplegarse en **Render** (como *Static Site* gratuito o *Web Service*).

## Opción 1: Despliegue como Static Site en Render (Recomendada y Gratuita)

1. Subí este repositorio a tu cuenta de **GitHub**.
2. Ingresá a [dashboard.render.com](https://dashboard.render.com/).
3. Hacé clic en **New +** y seleccioná **Static Site**.
4. Conectá tu repositorio de GitHub.
5. Completá los campos:
   - **Name**: `tecnorosario-ar`
   - **Branch**: `main` (o tu rama activa)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Hacé clic en **Create Static Site**.

¡Listo! Cada vez que hagas un `git push` (commit), Render compilará y actualizará el sitio automáticamente.

---

## Opción 2: Usar Render Blueprint (`render.yaml`)

El proyecto incluye el archivo `render.yaml`. En Render podés ir a **New +** -> **Blueprint**, seleccionar este repositorio y se configurarán los comandos y rutas SPA automáticamente.
