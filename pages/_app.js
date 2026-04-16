import '../styles/globals.css'
import { ThemeProvider } from '../hooks/useTheme'

export default function App({ Component, pageProps }) {
  // Pages that manage their own Layout (admin pages, or pages with singlePage layout)
  if (pageProps.adminPage || pageProps.customLayout) {
    return (
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
  // Default: component handles its own Layout (as index.js does with singlePage)
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}