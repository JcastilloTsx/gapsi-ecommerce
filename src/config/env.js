// Configuración centralizada: única fuente de verdad para el acceso a la API.
// La llave nunca se hardcodea aquí, se lee de la variable de entorno VITE_RAPIDAPI_KEY (.env, no versionado).
export const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY
export const RAPIDAPI_HOST = 'axesso-walmart-data-service.p.rapidapi.com'
export const WALMART_SEARCH_URL = `https://${RAPIDAPI_HOST}/wlm/walmart-search-by-keyword`
