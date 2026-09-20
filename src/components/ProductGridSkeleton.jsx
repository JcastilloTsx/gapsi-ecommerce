function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-block skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-block skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton-block skeleton-line" style={{ width: '55%', marginBottom: 0 }} />
      </div>
    </div>
  )
}

// Placeholder mientras se resuelve la primera página de una búsqueda: evita la
// sensación de "se quedó pegado" cuando el API tarda (p. ej. términos muy genéricos).
export default function ProductGridSkeleton() {
  return (
    <div className="product-row" role="status" aria-live="polite" aria-label="Cargando productos">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
