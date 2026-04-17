# Google Search Console Setup Guide

This portfolio has been configured for Google Search Console and search engine optimization. Here's what has been implemented:

## ✅ Implemented SEO Features

### 1. **Meta Tags** (`pages/_document.js`)
- Character encoding (UTF-8)
- Viewport for responsive design
- Description and keywords
- Robots directive for indexing
- Canonical URL
- Open Graph tags for social sharing
- Twitter Card tags for Twitter sharing
- Google Search Console verification field

### 2. **Sitemap** (`public/sitemap.xml`)
- XML sitemap with all main pages
- Change frequency and priority settings
- Helps search engines discover and index pages

### 3. **Robots.txt** (`public/robots.txt`)
- Allows search engines to crawl public pages
- Blocks crawling of admin and API routes
- Sets crawl delay for optimal server load
- Points to sitemap location

### 4. **Structured Data** (`lib/seo.js`)
- Schema.org JSON-LD markup
- Person schema for portfolio owner
- Website schema for search action
- Improves rich snippets in search results

### 5. **SEO Components** (`components/SEOHead.js`)
- Reusable component for consistent meta tags
- Automatic structured data injection
- Easy page-specific SEO customization

### 6. **Security Headers** (`next.config.js`)
- X-Content-Type-Options: Prevents MIME type sniffing
- X-Frame-Options: Prevents clickjacking
- X-XSS-Protection: Enables XSS protection
- Referrer-Policy: Controls referrer information

### 7. **Performance Optimizations**
- SWC minification enabled
- Image optimization for external domains
- DNS prefetch for external resources

## 🚀 Next Steps for Google Search Console

### 1. **Update Domain-Specific Values**

In `pages/_document.js`, replace:
```javascript
- <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
```

With your actual Google verification code from Google Search Console.

### 2. **Update Domain in Files**

Replace `https://kija-maharjan.com` with your actual domain in:
- `public/sitemap.xml` - All URLs
- `lib/seo.js` - defaultMeta.url and all references
- `pages/_document.js` - Canonical URL and og:url
- `components/SEOHead.js` - If you modify the component

### 3. **Add Verification to Google Search Console**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website)
3. Use the HTML file method (already provided: `google7e2798d057881bde.html`)
4. Or use the meta tag method with the verification code from GSC
5. Verify ownership

### 4. **Submit Sitemap**

After verification:
1. Go to "Sitemaps" in Google Search Console
2. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor coverage and errors

### 5. **Optimize Images for Rich Results**

Add Open Graph images to:
- Create `/public/og-image.png` (1200x630px)
- Update image paths in `lib/seo.js` if different location

### 6. **Update Social Links**

In `lib/seo.js`, update social media URLs in `getStructuredData()`:
```javascript
sameAs: [
  'https://github.com/YOUR_USERNAME',
  'https://linkedin.com/in/YOUR_PROFILE',
  'https://twitter.com/YOUR_HANDLE',
],
```

## 📊 Monitoring

### Google Search Console Dashboard
- **Performance**: Track clicks, impressions, CTR
- **Coverage**: Monitor indexing status
- **Core Web Vitals**: Track page experience metrics
- **Mobile Usability**: Check mobile compatibility
- **Manual Actions**: Watch for spam/quality issues

### Bing Webmaster Tools
Consider adding to [Bing Webmaster Tools](https://www.bing.com/webmasters) as well.

## 🔧 Using SEO Head Component

For pages that need custom meta tags, import and use the SEOHead component:

```javascript
import SEOHead from '../components/SEOHead'

export default function YourPage() {
  return (
    <>
      <SEOHead
        title="Your Page Title"
        description="Your page description"
        url="https://yourdomain.com/your-page"
        image="https://yourdomain.com/image.png"
      />
      {/* Your page content */}
    </>
  )
}
```

## 📋 SEO Checklist

- [ ] Update domain name in all files
- [ ] Add Google verification code to meta tag
- [ ] Create og-image.png (1200x630px)
- [ ] Update social links in schema
- [ ] Submit to Google Search Console
- [ ] Submit sitemap in GSC
- [ ] Submit to Bing Webmaster Tools
- [ ] Add canonical URLs to all pages
- [ ] Test with Google Mobile-Friendly Test
- [ ] Test with Rich Result Tester
- [ ] Monitor GSC for errors and warnings
- [ ] Set up Google Analytics (optional)

## 🔗 Useful Resources

- [Google Search Central](https://developers.google.com/search)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Page Speed Insights](https://pagespeed.web.dev/)
- [Schema.org](https://schema.org)

## 🐛 Common Issues

**Sitemap not found**: Make sure `public/sitemap.xml` is deployed
**Robots.txt not found**: Make sure `public/robots.txt` is deployed
**Verification fails**: Check that your verification code is correct and deployed
**Pages not indexing**: Check robots.txt and meta tags allow indexing

---

Your portfolio is now ready for Google Search Console! 🎉
