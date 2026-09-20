// PATRÓN: Adapter.
// Axesso puede devolver los campos de producto con distintos nombres según el endpoint/versión.
// Este archivo es el único punto que conoce esa forma cruda: adapta la respuesta externa
// a un modelo `Product` estable que el resto de la app consume sin preocuparse por el origen.
export function adaptProduct(raw, index) {
  const id = raw.usItemId || raw.itemId || raw.productId || `${raw.name || raw.title || 'item'}-${index}`
  const image = raw.image || raw.imageUrl || raw.thumbnail || raw.productImage || raw.primaryImageUrl || ''
  const title = raw.title || raw.name || raw.productName || 'Producto Gapsi'
  const preciseLine = raw.priceInfo?.priceDetails?.priceLines?.find((line) => line.lineType === 'CURRENT_PRICE')
  const precisePrice = preciseLine?.values?.find((value) => value.key === 'PRICE')?.value
  const price = Number(precisePrice || raw.price || raw.currentPrice || raw.salePrice || raw.productPrice || 0)
  const description = raw.description || raw.shortDescription || ''
  return { id: String(id), image, title, price, description }
}

export function adaptProductList(rawList) {
  return Array.isArray(rawList) ? rawList.map(adaptProduct) : []
}
