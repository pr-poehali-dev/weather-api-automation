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

export const generateDetailedWeatherSchema = (data: {
  city: string;
  region: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  clouds: number;
  sunrise?: number;
  sunset?: number;
}) => {
  const currentDate = new Date().toISOString();
  
  return {
    '@context': 'https://schema.org',
    '@type': ['Place', 'WebPage'],
    'name': data.city,
    'description': `Актуальная погода в ${data.city}. Температура ${data.temp}°C, ${data.condition}`,
    'url': `https://masclimat.ru/city/${data.city}`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': data.city,
      'addressRegion': data.region,
      'addressCountry': 'RU'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': data.lat,
      'longitude': data.lon
    },
    'mainEntity': {
      '@type': 'WeatherForecast',
      'name': `Прогноз погоды для ${data.city}`,
      'description': `Текущая погода и прогноз для ${data.city}, ${data.region}`,
      'datePublished': currentDate,
      'validThrough': new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      'areaServed': {
        '@type': 'City',
        'name': data.city,
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': data.lat,
          'longitude': data.lon
        }
      },
      'provider': {
        '@type': 'Organization',
        'name': 'MASCLIMAT.RU',
        'url': 'https://masclimat.ru'
      }
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Температура',
        'value': data.temp,
        'unitText': '°C'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Ощущается как',
        'value': data.feelsLike,
        'unitText': '°C'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Условия',
        'value': data.condition
      },
      {
        '@type': 'PropertyValue',
        'name': 'Влажность',
        'value': data.humidity,
        'unitText': '%'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Атмосферное давление',
        'value': data.pressure,
        'unitText': 'гПа'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Скорость ветра',
        'value': data.windSpeed,
        'unitText': 'м/с'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Направление ветра',
        'value': data.windDeg,
        'unitText': '°'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Видимость',
        'value': data.visibility / 1000,
        'unitText': 'км'
      },
      {
        '@type': 'PropertyValue',
        'name': 'Облачность',
        'value': data.clouds,
        'unitText': '%'
      }
    ]
  };
};

export const addStructuredData = (data: any, id?: string) => {
  const scriptId = id || 'structured-data-main';
  let script = document.querySelector(`script#${scriptId}`);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', scriptId);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
};

export const addBreadcrumbSchema = (breadcrumbs: Array<{name: string; url: string}>) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
  addStructuredData(schema, 'breadcrumb-schema');
};