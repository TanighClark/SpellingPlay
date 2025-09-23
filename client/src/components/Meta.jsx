import { useEffect } from 'react';

function setMetaName(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setMetaProperty(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function Meta({ title, description, canonical, ogImage }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMetaName('description', description);
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const resolvedUrl =
      canonical || (typeof window !== 'undefined' ? window.location.href : '');
    const resolvedImage =
      ogImage || (origin ? `${origin}/og-image.png` : '/og-image.png');

    // Open Graph
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', resolvedUrl);
    setMetaProperty('og:image', resolvedImage);
    setMetaProperty('og:type', 'website');

    // Twitter
    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:image', resolvedImage);
  }, [title, description, canonical, ogImage]);

  return null;
}

export function JsonLd({ data }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  return null;
}
