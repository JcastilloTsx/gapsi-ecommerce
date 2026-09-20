function formatPrice(value) {
  return value ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Consultar'
}

// El navegador rasteriza la imagen de arrastre en el instante de dragstart, así que el
// nodo solo necesita existir fuera de pantalla ese momento; se descarta en el siguiente tick.
function createDragPreview(product) {
  const el = document.createElement('div')
  el.className = 'drag-preview'

  const img = document.createElement('img')
  img.src = product.image
  img.alt = ''
  el.appendChild(img)

  const info = document.createElement('div')
  const title = document.createElement('strong')
  title.textContent = product.title
  const price = document.createElement('span')
  price.textContent = formatPrice(product.price)
  info.append(title, price)
  el.appendChild(info)

  document.body.appendChild(el)
  return el
}

function handleDragStart(event, product) {
  event.dataTransfer.setData('productId', String(product.id))
  event.dataTransfer.effectAllowed = 'copy'
  const preview = createDragPreview(product)
  event.dataTransfer.setDragImage(preview, 30, 30)
  setTimeout(() => preview.remove(), 0)
}

export default function ProductCard({ product, onAdd, index }) {
  return (
    <article
      className="product-card"
      draggable
      onDragStart={(event) => handleDragStart(event, product)}
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
