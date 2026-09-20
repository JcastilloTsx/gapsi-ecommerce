import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { schema } from './schema'

// SchemaLink ejecuta las queries contra el esquema local (arriba) en vez de viajar por HTTP:
// GraphQL real (parseo, validación, resolvers) corriendo enteramente en el navegador.
export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
})
