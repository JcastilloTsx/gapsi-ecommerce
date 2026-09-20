function formatPrice(value) {
  return value ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Consultar'
}

export default function ProductCard({ product, onAdd, index }) {
  return (
    <article
      className="product-card"
      draggable
      onDragStart={(event) => event.dataTransfer.setData('productId', String(product.id))}
      style={{ '--delay': `${Math.min(index, 10) * 35}ms` }}
    >
      <div className="product-image-wrap">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" />
        ) : (
          <div className="image-fallback"><i className="fa-solid fa-bag-shopping" /></div>
        )}
        <button type="button" className="add-button" onClick={() => onAdd(product)} aria-label={`Añadir ${product.title} al carrito`}>
          <i className="fa-solid fa-cart-plus" />
        </button>
      </div>
      <div className="product-info">
        <h3 title={product.title}>{product.title}</h3>
        <div className="product-bottom">
          <span className="price">{formatPrice(product.price)}</span>
          <span className="drag-label">arrastrar al carrito</span>
        </div>
      </div>
    </article>
  )
}
