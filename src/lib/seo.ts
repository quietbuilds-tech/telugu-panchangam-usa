/**
 * SEO utilities and structured data helpers
 */

import type { Lang } from '@/i18n';

export interface StructuredDataProps {
  site: string;
  lang: Lang;
  brandTitle: string;
}

/**
 * Generate Event schema for a festival
 */
export function createFestivalEventSchema(
  festivalName: string,
  date: string,
  site: string,
  lang: Lang,
  brandTitle: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": festivalName,
    "startDate": date,
    "endDate": date,
    "image": `${site}/og-image.png`,
    "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "New Jersey, USA",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "NJ",
        "addressCountry": "US"
      }
    },
    "description": lang === 'te'
      ? `${festivalName} పండుగ`
      : `${festivalName} festival`,
    "organizer": {
      "@type": "Organization",
      "name": brandTitle,
      "url": site
    },
    "inLanguage": lang
  };
}

/**
 * Generate Article schema for content pages
 */
export function createArticleSchema(
  title: string,
  description: string,
  url: string,
  date: string,
  site: string,
  brandTitle: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": `${site}/og-image.png`,
    "datePublished": `${date}T00:00:00-05:00`,
    "dateModified": `${date}T00:00:00-05:00`,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": brandTitle,
      "url": site
    },
    "publisher": {
      "@type": "Organization",
      "name": brandTitle,
      "logo": {
        "@type": "ImageObject",
        "url": `${site}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function createBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  site: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${site}${crumb.url}`
    }))
  };
}

/**
 * Truncate description to optimal length for SEO
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  // Try to break at last complete sentence or word
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastPeriod > maxLength - 50) {
    return truncated.substring(0, lastPeriod + 1);
  } else if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Generate title with optimal length (50-60 characters)
 */
export function optimizeTitle(title: string, suffix?: string, maxLength: number = 60): string {
  if (!suffix) return title;

  const combined = `${title} - ${suffix}`;
  if (combined.length <= maxLength) return combined;

  // If too long, truncate the main title
  const available = maxLength - suffix.length - 3; // 3 for " - "
  if (available < 20) return title; // Don't make it too short

  return `${title.substring(0, available)}... - ${suffix}`;
}

/**
 * Extract keywords from panchangam data
 */
export function extractPanchangamKeywords(
  tithi: string,
  nakshatra: string,
  masam: string,
  festivals: string[],
  lang: Lang
): string {
  const keywords = [tithi, nakshatra, masam, ...festivals].filter(Boolean);

  const baseKeywords = lang === 'te'
    ? ['తెలుగు పంచాంగం', 'తిథి', 'నక్షత్రం']
    : ['telugu panchangam', 'tithi', 'nakshatra'];

  return [...baseKeywords, ...keywords].join(', ');
}
