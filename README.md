# e-Commerce Gapsi

Buscador de productos y carrito de compras para Gapsi e-Commerce. Front-end puro (React 19 + Vite) que consume el servicio REST de Axesso (Walmart) para mostrar resultados de búsqueda con scroll infinito y virtual scroll, y permite armar un carrito arrastrando productos o con el botón "+".

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
- `src/components/` — un componente por responsabilidad (Header, SearchHero, ProductGrid, ProductCard, SortMenu, CartPanel).

## Funcionalidad

- Búsqueda por palabra clave contra el servicio REST de Axesso.
- Tarjetas con nombre, precio e imagen.
- Scroll infinito: cada scroll cerca del final pide la siguiente página.
- **Virtual scroll** real (`@tanstack/react-virtual`): solo se montan en el DOM las filas visibles del grid, sin importar cuántas páginas se hayan cargado.
- Drag & drop de producto al carrito (HTML5 nativo), con botón "+" como alternativa accesible.
- Un producto agregado al carrito desaparece del listado.
- Botón de reinicio (arriba a la derecha) que limpia búsqueda, resultados y carrito.
- Ordenar por relevancia / precio (Material-UI `Select`).

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
