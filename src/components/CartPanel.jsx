import { useState } from 'react'

function formatPrice(value) {
  return value ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Consultar'
}

export default function CartPanel({ cart, onDrop, onRemove }) {
  const [isOver, setIsOver] = useState(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <aside
      className={`cart-panel ${isOver ? 'cart-panel-active' : ''}`}
      onDragOver={(event) => { event.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        const dropPoint = { left: event.clientX - 25, top: event.clientY - 25, width: 50, height: 50 }
        onDrop(event.dataTransfer.getData('productId'), dropPoint)
        setIsOver(false)
      }}
    >
      <div className="cart-heading">
        <div><p className="eyebrow">Tu selección</p><h2>Carrito <span key={cart.length} className="cart-badge">{cart.length}</span></h2></div>
        <i className="fa-solid fa-bag-shopping" />
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <i className="fa-solid fa-bag-shopping" style={{ fontSize: 33 }} />
          <h3>Arrastra productos aquí</h3>
          <p>O usa el botón + en cualquier producto para añadirlo.</p>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div><strong>{item.title}</strong><span>{formatPrice(item.price)}</span></div>
              <button type="button" onClick={() => onRemove(item.id)} aria-label={`Eliminar ${item.title}`}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-footer"><span>Total estimado</span><strong>{formatPrice(total)}</strong></div>
      )}

      <div className="drop-hint" aria-hidden="true">
        <i className="fa-solid fa-bag-shopping" />
        <span>Suelta aquí</span>
      </div>
    </aside>
  )
}
