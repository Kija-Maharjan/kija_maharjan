import Head from 'next/head'
import { getSEOMeta, getStructuredData, defaultMeta } from '../lib/seo'

export default function SEOHead({ 
  title, 
  description, 
  url, 
  image, 
  type = 'website',
  structured = true 
}) {
  const meta = getSEOMeta({
    title,
    description,
    url,
    image,
    type,
  })

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={meta.canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:image" content={meta.openGraph.image} />
      <meta property="og:site_name" content={meta.openGraph.site_name} />

      {/* Twitter */}
      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />

      {/* Structured Data */}
      {structured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredData('Person')),
          }}
        />
      )}
    </Head>
  )
}
