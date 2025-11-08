import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export const updateSEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  noindex = false
}: SEOProps) => {
  document.title = title;

  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMetaTag('description', description);
  if (keywords) {
    setMetaTag('keywords', keywords);
  }

  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:type', 'website', true);
  
  if (ogImage) {
    setMetaTag('og:image', ogImage, true);
    setMetaTag('twitter:image', ogImage);
  }

  if (canonicalUrl) {
    setMetaTag('og:url', canonicalUrl, true);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }

  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);

  let robots = document.querySelector('meta[name="robots"]');
  if (noindex) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
  } else if (robots) {
    robots.remove();
  }
};

export const useSEO = (props: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    updateSEO(props);
  }, [location.pathname, props.title, props.description]);
};

export const generateWeatherSchema = (city: string, temp: number, condition: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Погода в ${city}`,
    description: `Актуальный прогноз погоды для города ${city}. Температура ${temp}°C, ${condition}.`,
    about: {
      '@type': 'Place',
      name: city,
      geo: {
        '@type': 'GeoCoordinates'
      }
    },
    provider: {
      '@type': 'Organization',
      name: 'MASCLIMAT.RU',
      url: 'https://masclimat.ru'
    }
  };
};

export const addStructuredData = (data: any) => {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};
