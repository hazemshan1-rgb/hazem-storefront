import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://hazemshannak.cc'

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({
  title = 'Hazem Shannak — Aquaculture Systems & Profitability',
  description = 'Turning aquaculture ventures into high-yield, investment-ready enterprises through field-tested frameworks and 30 years of expertise across 15 countries.',
  image = '/images/hero/hazem-studio.jpg',
  url,
  type = 'website',
  jsonLd,
}: SEOProps) {
  const siteTitle = title.includes('Hazem Shannak') ? title : `${title} | Hazem Shannak`;
  const canonical = url ? `${BASE_URL}${url}` : undefined;
  const ogImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
