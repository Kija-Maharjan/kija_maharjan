import Layout from '../components/Layout'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  // Admin pages use their own layout
  if (pageProps.adminPage) {
    return <Component {...pageProps} />
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
