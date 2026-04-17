// SEO configuration and utilities for consistent meta tags

export const defaultMeta = {
  title: 'Kija Maharjan - Full Stack Developer',
  description: 'Full Stack Developer specializing in web development, open source contributions, and innovative solutions.',
  url: 'https://kija-maharjan.com',
  image: 'https://kija-maharjan.com/og-image.png',
  author: 'Kija Maharjan',
}

export const getSEOMeta = (page = {}) => {
  return {
    title: page.title || defaultMeta.title,
    description: page.description || defaultMeta.description,
    canonical: page.canonical || defaultMeta.url,
    openGraph: {
      type: page.type || 'website',
      url: page.url || defaultMeta.url,
      title: page.title || defaultMeta.title,
      description: page.description || defaultMeta.description,
      image: page.image || defaultMeta.image,
      site_name: 'Kija Maharjan Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title || defaultMeta.title,
      description: page.description || defaultMeta.description,
      image: page.image || defaultMeta.image,
    },
  }
}

// Structured Data (Schema.json)
export const getStructuredData = (type = 'Person') => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: 'Kija Maharjan',
    url: 'https://kija-maharjan.com',
    image: 'https://kija-maharjan.com/og-image.png',
    jobTitle: 'Full Stack Developer',
    description: 'Full Stack Developer specializing in web development and open source',
  }

  if (type === 'Person') {
    return {
      ...baseSchema,
      sameAs: [
        'https://github.com/kija-maharjan',
        'https://linkedin.com/in/kija-maharjan',
        'https://twitter.com/kija-maharjan',
      ],
    }
  }

  if (type === 'WebSite') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Kija Maharjan Portfolio',
      url: 'https://kija-maharjan.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://kija-maharjan.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }
  }

  return baseSchema
}
