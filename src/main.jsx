import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { ThemeProvider } from '@mui/material/styles'
import App from './App'
import { apolloClient } from './graphql/client'
import { theme } from './theme'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
)
