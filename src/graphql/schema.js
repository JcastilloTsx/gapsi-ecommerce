// Esquema GraphQL ejecutado en el propio navegador (Apollo SchemaLink, sin servidor):
// el resolver delega en el Repository (walmartService), así que la búsqueda real sigue
// siendo un único fetch REST — GraphQL es la capa de consulta que usa la UI.
import { makeExecutableSchema } from '@graphql-tools/schema'
import { searchWalmartProducts } from '../services/walmartService'

const typeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    title: String!
    price: Float!
    image: String
    description: String
  }

  type SearchResult {
    products: [Product!]!
    hasMore: Boolean!
  }

  type Query {
    searchProducts(keyword: String!, page: Int!): SearchResult!
  }
`

const resolvers = {
  Query: {
    searchProducts: async (_parent, { keyword, page }) => searchWalmartProducts(keyword, page),
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
