import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { apolloClient } from './graphql/client'
import { SEARCH_PRODUCTS } from './graphql/queries'
import Header from './components/Header'
import SearchHero from './components/SearchHero'
import SortMenu from './components/SortMenu'
import ProductGrid from './components/ProductGrid'
import CartPanel from './components/CartPanel'

async function fetchProductsPage(keyword, page) {
  const { data } = await apolloClient.query({
    query: SEARCH_PRODUCTS,
    variables: { keyword, page },
    fetchPolicy: 'network-only',
  })
  return data.searchProducts
}

function App() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [sort, setSort] = useState('Relevancia')

  const loadProducts = async (term, requestedPage, replace = false) => {
    if (!term.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const { products: nextProducts, hasMore: more } = await fetchProductsPage(term.trim(), requestedPage)
      setProducts((current) => {
        // Walmart repite productos entre stacks/páginas (patrocinados + grid principal);
        // se descartan duplicados por id para no romper las keys de React ni el listado.
        const base = replace ? [] : current
        const seenIds = new Set(base.map((product) => product.id))
        const dedupedNext = nextProducts.filter((product) => !seenIds.has(product.id) && seenIds.add(product.id))
        return [...base, ...dedupedNext]
      })
      setHasMore(more)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const runSearch = (term) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setQuery(trimmed)
    setSubmittedQuery(trimmed)
    setPage(1)
    setHasMore(true)
    loadProducts(trimmed, 1, true)
  }

  const loadNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadProducts(submittedQuery, nextPage)
  }

  const visibleProducts = products
    .filter((product) => !cart.some((item) => item.id === product.id))
    .sort((a, b) => (sort === 'Precio menor' ? a.price - b.price : sort === 'Precio mayor' ? b.price - a.price : 0))

  const addToCart = (product) => {
    setCart((current) => (current.some((item) => item.id === product.id) ? current : [...current, product]))
  }

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const dropIntoCart = (productId) => {
    const product = products.find((item) => String(item.id) === productId)
    if (product) addToCart(product)
  }

  const resetApp = () => {
    setQuery('')
    setSubmittedQuery('')
    setProducts([])
    setCart([])
    setPage(1)
    setError('')
    setHasMore(true)
  }

  return (
    <main className="app-shell">
      <Header onReset={resetApp} />

      <SearchHero
        query={query}
        onQueryChange={setQuery}
        onSubmit={(event) => { event.preventDefault(); runSearch(query) }}
        onQuickSearch={runSearch}
      />

      <section className="workspace" aria-label="Catálogo y carrito">
        <div className="catalog-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{submittedQuery ? 'Resultados para' : 'Tu escaparate'}</p>
              <h2>{submittedQuery || 'Comienza una búsqueda'}</h2>
            </div>
            {products.length > 0 && <SortMenu value={sort} onChange={setSort} />}
          </div>

          {error && <Alert severity="error" className="error-message">{error}</Alert>}

          {!submittedQuery && !loading && (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-solid fa-magnifying-glass" /></div>
              <h3>Tu próxima compra empieza aquí</h3>
              <p>Escribe arriba lo que necesitas y te mostraremos las mejores coincidencias.</p>
            </div>
          )}

          {submittedQuery && !loading && !error && visibleProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-solid fa-bag-shopping" /></div>
              <h3>No encontramos productos disponibles</h3>
              <p>Prueba con otra palabra o una marca diferente.</p>
            </div>
          )}

          {visibleProducts.length > 0 && (
            <ProductGrid
              products={visibleProducts}
              onAdd={addToCart}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadNextPage}
            />
          )}

          <div className="load-status">
            {loading && <><CircularProgress size={18} /> Cargando más productos...</>}
            {!loading && submittedQuery && !hasMore && visibleProducts.length > 0 && 'Has llegado al final del catálogo'}
          </div>
        </div>

        <CartPanel cart={cart} onDrop={dropIntoCart} onRemove={removeFromCart} />
      </section>

      <footer>e-Commerce Gapsi <span>•</span> Una experiencia de compra más simple</footer>
    </main>
  )
}

export default App
