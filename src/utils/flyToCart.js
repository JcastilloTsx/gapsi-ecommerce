// El "focal moment" del carrito: una miniatura clonada viaja desde donde el producto
// vivía hasta el ícono del carrito, dejando explícita la relación espacial "esto se movió
// de la grilla al carrito" en vez de que el ítem aparezca de golpe en la lista.
export function flyToCart(sourceRect, imageSrc) {
  if (!sourceRect) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const target = document.querySelector('.cart-heading i')
  if (!target) return
  const targetRect = target.getBoundingClientRect()

  const clone = document.createElement(imageSrc ? 'img' : 'div')
  if (imageSrc) clone.src = imageSrc
  clone.className = 'fly-clone'
  Object.assign(clone.style, {
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
  })
  document.body.appendChild(clone)

  const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
  const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(.15)`
    clone.style.opacity = '0'
  })

  setTimeout(() => clone.remove(), 650)
}
