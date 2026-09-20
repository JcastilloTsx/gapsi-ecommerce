import { gql } from '@apollo/client'

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!, $page: Int!) {
    searchProducts(keyword: $keyword, page: $page) {
      hasMore
      products {
        id
        title
        price
        image
        description
      }
    }
  }
`
