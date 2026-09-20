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
        onDrop(event.dataTransfer.getData('productId'))
        setIsOver(false)
      }}
    >
      <div className="cart-heading">
        <div><p className="eyebrow">Tu selección</p><h2>Carrito <span>{cart.length}</span></h2></div>
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
    </aside>
  )
}
