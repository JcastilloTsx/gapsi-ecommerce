// PATRÓN: Repository.
// Único módulo que sabe cómo llegar al servicio REST externo (URL, headers, llave).
// El resto de la app (UI, capa GraphQL) pide productos por palabra clave/página y no conoce
// fetch, headers ni el shape crudo de Axesso — si el proveedor cambia, solo se toca este archivo.
import { RAPIDAPI_KEY, RAPIDAPI_HOST, WALMART_SEARCH_URL } from '../config/env'
import { adaptProductList } from '../adapters/productAdapter'

export async function searchWalmartProducts(keyword, page) {
  if (!RAPIDAPI_KEY) throw new Error('Configura VITE_RAPIDAPI_KEY en tu archivo .env para consultar el catálogo.')

  const params = new URLSearchParams({ keyword, page: String(page), sortBy: 'best_match' })
  const response = await fetch(`${WALMART_SEARCH_URL}?${params}`, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  })

  if (!response.ok) throw new Error(`No se pudo consultar el catálogo (${response.status}).`)

  const payload = await response.json()
  // Axesso devuelve un payload estilo Next.js: los productos viven repartidos en
  // varios "stacks" (grid principal, patrocinados, relacionados...) dentro de itemStacks.
  const searchResult = payload?.item?.props?.pageProps?.initialData?.searchResult
  const rawProducts = (searchResult?.itemStacks || [])
    .flatMap((stack) => stack.items || [])
    .filter((item) => item.__typename === 'Product')

  return {
    products: adaptProductList(rawProducts),
    hasMore: Boolean(searchResult?.hasMorePages),
  }
}
