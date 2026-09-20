import { useEffect, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useColumnCount } from '../hooks/useColumnCount'
import ProductCard from './ProductCard'

// Virtual scroll: solo se montan en el DOM las filas visibles (+ overscan).
// El contenedor tiene su propio scroll acotado (mismo patrón que la referencia de Gapsi:
// panel con scrollbar propia, no la página completa).
export default function ProductGrid({ products, onAdd, loading, hasMore, onLoadMore }) {
  const columns = useColumnCount()
  const scrollRef = useRef(null)

  const rows = useMemo(() => {
    const chunks = []
    for (let i = 0; i < products.length; i += columns) chunks.push(products.slice(i, i + columns))
    return chunks
  }, [products, columns])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 298,
    overscan: 3,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const lastVisibleRow = virtualItems.at(-1)?.index ?? 0

  useEffect(() => {
    if (!loading && hasMore && rows.length > 0 && lastVisibleRow >= rows.length - 2) onLoadMore()
  }, [lastVisibleRow, hasMore, loading, rows.length, onLoadMore])

  return (
    <div className="product-scroll" ref={scrollRef}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className="product-row"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
          >
            {rows[virtualRow.index].map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onAdd={onAdd} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
