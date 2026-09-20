const QUICK_TERMS = ['laptop', 'headphones', 'nintendo']

export default function SearchHero({ query, onQueryChange, onSubmit, onQuickSearch }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow"><i className="fa-solid fa-sparkles" /> búsqueda inteligente</p>
        <h1>Encuentra algo que <em>te encante.</em></h1>
        <p className="hero-description">Explora miles de productos y llévalos a tu carrito de forma sencilla.</p>
      </div>
      <form className="search-form" onSubmit={onSubmit}>
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <label className="sr-only" htmlFor="search">¿Qué estás buscando?</label>
        <input id="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Busca productos, marcas o categorías" />
        <button type="submit">Buscar</button>
      </form>
      <div className="quick-searches">
        <span>Prueba con:</span>
        {QUICK_TERMS.map((term) => (
          <button type="button" key={term} onClick={() => onQuickSearch(term)}>{term}</button>
        ))}
      </div>
    </section>
  )
}
