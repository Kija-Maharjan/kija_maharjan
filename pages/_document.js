import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Character encoding */}
        <meta charSet="utf-8" />
        
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Kija Maharjan - Full Stack Developer specializing in web development, open source, and innovative solutions." />
        <meta name="keywords" content="developer, full stack, portfolio, projects, web development" />
        <meta name="author" content="Kija Maharjan" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kija-maharjan.com" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kija Maharjan - Full Stack Developer" />
        <meta property="og:description" content="Explore my portfolio of web development projects and open source contributions" />
        <meta property="og:url" content="https://kija-maharjan.com" />
        <meta property="og:image" content="https://kija-maharjan.com/og-image.png" />
        <meta property="og:site_name" content="Kija Maharjan Portfolio" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kija Maharjan - Full Stack Developer" />
        <meta name="twitter:description" content="Explore my portfolio of web development projects" />
        <meta name="twitter:image" content="https://kija-maharjan.com/og-image.png" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="google7e2798d057881bde" />
        
        {/* Sitemap and Robots */}
        <link rel="sitemap" href="/sitemap.xml" />
        
        {/* Preconnect for external domains */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
