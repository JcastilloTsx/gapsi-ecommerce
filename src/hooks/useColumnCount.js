import { useEffect, useState } from 'react'

// Espeja los breakpoints de .product-grid en styles.css (3 columnas / 2 en móvil)
// para que el virtualizador agrupe los productos en filas del tamaño correcto.
export function useColumnCount() {
  const getColumns = () => (window.matchMedia('(max-width: 640px)').matches ? 2 : 3)
  const [columns, setColumns] = useState(getColumns)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)')
    const onChange = () => setColumns(getColumns())
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return columns
}
