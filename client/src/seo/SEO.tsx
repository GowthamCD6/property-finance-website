import React, { useEffect } from 'react';
import {
  updateTitle,
  updateMetaTag,
  updateLinkTag,
  updateJsonLd,
  removeJsonLd,
} from './seoUtils';
import {
  DEFAULT_OG_IMAGE,
  BreadcrumbItem,
  buildBreadcrumbSchema,
} from './seoConfig';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Reusable SEO Component
 * Dynamically synchronizes document title, canonical URLs, robots meta, Open Graph,
 * Twitter card tags, and Schema.org JSON-LD structured data upon route mount and transitions.
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  twitterTitle,
  twitterDescription,
  twitterImage = DEFAULT_OG_IMAGE,
  breadcrumbs,
  structuredData,
}) => {
  useEffect(() => {
    // 1. Document Title
    const finalTitle = title || 'Prime Associates Loans – Loan Advisory & Financial Guidance';
    updateTitle(finalTitle);

    // 2. Primary Meta Directives
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'robots', robots);

    // 3. Canonical URL
    updateLinkTag('canonical', canonical);

    // 4. Open Graph Social Metadata
    const finalOgTitle = ogTitle || title;
    const finalOgDesc = ogDescription || description;
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', 'Prime Associates Loans');
    updateMetaTag('property', 'og:locale', 'en_IN');
    updateMetaTag('property', 'og:title', finalOgTitle);
    updateMetaTag('property', 'og:description', finalOgDesc);
    updateMetaTag('property', 'og:url', canonical);
    updateMetaTag('property', 'og:image', ogImage);

    // 5. Twitter Card Metadata
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', twitterTitle || finalOgTitle);
    updateMetaTag('name', 'twitter:description', twitterDescription || finalOgDesc);
    updateMetaTag('name', 'twitter:image', twitterImage || ogImage);

    // 6. Schema.org BreadcrumbList
    if (breadcrumbs && breadcrumbs.length > 0) {
      updateJsonLd('breadcrumbs', buildBreadcrumbSchema(breadcrumbs));
    } else {
      removeJsonLd('breadcrumbs');
    }

    // 7. Route-Level Schema.org Structured Data (Service / Organization / WebSite)
    if (structuredData) {
      updateJsonLd('route', structuredData);
    } else {
      removeJsonLd('route');
    }
  }, [
    title,
    description,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    breadcrumbs,
    structuredData,
  ]);

  return null;
};

export default SEO;
