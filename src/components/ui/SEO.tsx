import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'Hazem Shannak — Aquaculture Resources',
  description = 'Premium ebooks, SOPs, and toolkits from 30 years of aquaculture expertise. Turn your farm into a high-yield enterprise.',
  image = '/images/hero/hazem-studio.jpg',
  url = 'https://hazemshannak.com',
  type = 'website',
}: SEOProps) {
  const siteTitle = title.includes('Hazem Shannak') ? title : `${title} | Hazem Shannak`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
