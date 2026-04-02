import Layout from '../components/Layout'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  // Admin pages use their own layout
  if (pageProps.adminPage) {
    return <Component {...pageProps} />
  }
  // Some pages (like the legacy single-page homepage) render their own full layout
  if (pageProps.noLayout) {
    return <Component {...pageProps} />
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
