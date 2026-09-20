# e-Commerce Gapsi

Buscador de productos y carrito de compras para Gapsi e-Commerce. Front-end puro (React 19 + Vite) que consume el servicio REST de Axesso (Walmart) para mostrar resultados de búsqueda con scroll infinito y virtual scroll, y permite armar un carrito arrastrando productos o con el botón "+".

## Cumplimiento de requisitos no funcionales

| Peso | Requisito | Estado | Evidencia |
|---|---|---|---|
| 5 | Virtual scroll en la lista de productos | ✅ | [`ProductGrid.jsx`](src/components/ProductGrid.jsx) — `useVirtualizer` de `@tanstack/react-virtual`; solo las filas visibles + overscan se montan en el DOM, sin importar cuántas páginas se hayan cargado. |
| 4 | ≥2 patrones de diseño, indicados en el código | ✅ | Ver [tabla de patrones](#arquitectura-y-patrones-de-diseño) — **Adapter** en [`productAdapter.js`](src/adapters/productAdapter.js), **Repository** en [`walmartService.js`](src/services/walmartService.js), ambos comentados como tal en el propio archivo. |
| 5 | Consumir el servicio REST de Axesso | ✅ | [`walmartService.js`](src/services/walmartService.js) — `fetch` con headers `x-rapidapi-key`/`x-rapidapi-host` al endpoint indicado en el enunciado. |
| 3 | Build minificado y ofuscado | ✅ | [`vite.config.js`](vite.config.js) — `build.minify: 'terser'` + `vite-plugin-javascript-obfuscator` (solo en `build`, no en `dev`). Verificado inspeccionando `dist/assets/*.js`: identificadores hexadecimales y string-array típicos de ofuscación real, no solo minificado. |
| 5 (deseable) | Drag & drop al carrito | ✅ | [`ProductCard.jsx`](src/components/ProductCard.jsx) + [`CartPanel.jsx`](src/components/CartPanel.jsx) — HTML5 DnD nativo (`draggable`, `dataTransfer`), con botón "+" como alternativa accesible por teclado. Animado en [`utils/flyToCart.js`](src/utils/flyToCart.js): imagen de arrastre personalizada, drop-zone reactivo, y el producto "vuela" del punto de origen al ícono del carrito al soltarlo. |
| 2 (deseable) | 1 feature de PWA | ✅ | [`vite.config.js`](vite.config.js) — `vite-plugin-pwa` genera `manifest.webmanifest` + service worker instalable (`registerType: 'autoUpdate'`). |
| 4 (deseable) | Material-UI | ✅ | `Select` en [`SortMenu.jsx`](src/components/SortMenu.jsx), `CircularProgress` y `Alert` en [`App.jsx`](src/App.jsx), tema propio en [`theme.js`](src/theme.js). |
| 4 (deseable) | GraphQL | ✅ | [`src/graphql/`](src/graphql) — esquema y resolver reales ejecutados en el navegador vía Apollo `SchemaLink` (sin servidor); la UI consulta con `apolloClient.query(SEARCH_PRODUCTS)` en vez de llamar al REST directamente. |
| 2 (deseable) | Font Awesome (o similar) desde CDN | ✅ | [`index.html`](index.html) — `cdnjs.cloudflare.com/.../font-awesome`. Todos los íconos de la app usan esta librería. |
| 1 (deseable) | Bootstrap (o similar) desde CDN | ✅ | [`index.html`](index.html) — `cdn.jsdelivr.net/npm/bootstrap`. |

## Requisitos previos

- Node.js 20 o superior
- Una llave de RapidAPI para `axesso-walmart-data-service`

## Puesta en marcha

```bash
npm install
cp .env.example .env
```

Edita `.env` y coloca tu llave:

```
VITE_RAPIDAPI_KEY=tu_llave_rapidapi
```

```bash
npm run dev
```

Abre `http://localhost:5173`. Prueba con términos en inglés o marcas: `laptop`, `headphones`, `nintendo`, `sony`.

## Build de producción

```bash
npm run build
npm run preview
```

El build queda minificado (Terser) y ofuscado (`javascript-obfuscator`) en `dist/`.

## Seguridad

- La llave de RapidAPI vive solo en `.env` (ignorado por git) y se lee vía `import.meta.env.VITE_RAPIDAPI_KEY` — nunca está hardcodeada en el código fuente.
- `.env.example` documenta la variable requerida sin exponer un valor real.
- Al ser una app 100% front-end (requisito del reto), la llave viaja en las peticiones que hace el propio navegador a RapidAPI; no hay forma de ocultarla del todo sin un backend intermedio, que está fuera del alcance de esta prueba.

## Arquitectura y patrones de diseño

| Patrón | Archivo | Rol |
|---|---|---|
| **Adapter** | [`src/adapters/productAdapter.js`](src/adapters/productAdapter.js) | Traduce el shape crudo e inconsistente de la respuesta de Axesso a un modelo `Product` estable que consume toda la UI. |
| **Repository** | [`src/services/walmartService.js`](src/services/walmartService.js) | Único punto que conoce la URL, headers y llave del servicio REST; expone `searchWalmartProducts(keyword, page)`. |

Capas adicionales:

- `src/config/env.js` — configuración centralizada (URL, host, llave), separada del resto del código.
- `src/graphql/` — esquema GraphQL ejecutado en el propio navegador (`SchemaLink` de Apollo Client, sin servidor): el resolver `searchProducts` delega en el Repository. La UI consulta vía `apolloClient.query(...)`.
- `src/hooks/useColumnCount.js` — número de columnas del grid según el viewport (espeja los breakpoints de `styles.css`).
- `src/utils/flyToCart.js` — animación de "vuelo" del producto hacia el carrito al agregarlo.
- `src/components/` — un componente por responsabilidad (Header, SearchHero, ProductGrid, ProductGridSkeleton, ProductCard, SortMenu, CartPanel).

## Funcionalidad

- Búsqueda por palabra clave contra el servicio REST de Axesso.
- Tarjetas con nombre, precio e imagen.
- Scroll infinito: cada scroll cerca del final pide la siguiente página.
- **Virtual scroll** real (`@tanstack/react-virtual`): solo se montan en el DOM las filas visibles del grid, sin importar cuántas páginas se hayan cargado.
- **Skeleton loading** ([`ProductGridSkeleton.jsx`](src/components/ProductGridSkeleton.jsx)): al enviar una búsqueda se limpian los resultados anteriores y se muestran placeholders con shimmer mientras responde el API, en vez de dejar el panel en blanco.
- Drag & drop de producto al carrito (HTML5 nativo), con botón "+" como alternativa accesible y animación de vuelo hacia el carrito en ambos casos.
- Un producto agregado al carrito desaparece del listado.
- Botón de reinicio (arriba a la derecha) que limpia búsqueda, resultados y carrito.
- Ordenar por relevancia / precio (Material-UI `Select`).
- Toda la animación (shimmer, vuelo al carrito, pulso del contador) respeta `prefers-reduced-motion`.

## Stack técnico

- **React 19** + **Vite**
- **@tanstack/react-virtual** — virtual scroll
- **Material-UI** — `Select`, `CircularProgress`, `Alert`
- **Apollo Client + GraphQL** (`SchemaLink`) — capa de consulta sobre el REST de Axesso
- **Font Awesome** (CDN) — iconografía
- **Bootstrap** (CDN) — reset/utilidades base
- **vite-plugin-pwa** — manifest + service worker (instalable, funcionalidad PWA mínima)
- **terser** + **vite-plugin-javascript-obfuscator** — build minificado y ofuscado

## Limitaciones conocidas

- El ícono de manifest PWA (`public/assets/icon.png`) es de baja resolución (32×32); es funcional pero no ideal para las guías de Chrome/Android de iconos de instalación.
- El bundle de producción (~830 KB sin comprimir) no está code-split; para esta prueba se priorizó simplicidad sobre lazy-loading de rutas.
