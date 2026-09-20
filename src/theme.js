import { createTheme } from '@mui/material/styles'

// Tema mínimo: solo alinea los pocos componentes MUI (Select, CircularProgress, Alert)
// a la paleta ya definida en styles.css. El resto de la UI sigue siendo CSS a mano.
export const theme = createTheme({
  palette: {
    primary: { main: '#1269d3', dark: '#0d4fa3' },
    error: { main: '#a73f3f' },
  },
  typography: { fontFamily: "'DM Sans', sans-serif" },
  shape: { borderRadius: 9 },
})
