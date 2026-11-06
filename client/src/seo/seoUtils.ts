/**
 * Pure DOM SEO Utility Functions
 * Ensures idempotent, leak-free meta tag and schema updates in React Single Page Applications.
 */

export const updateTitle = (title: string): void => {
  if (typeof document === 'undefined') return;
  document.title = title;
};

export const updateMetaTag = (
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string | undefined
): void => {
  if (typeof document === 'undefined') return;

  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!content) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

export const updateLinkTag = (rel: string, href: string | undefined): void => {
  if (typeof document === 'undefined') return;

  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!href) {
    if (element) {
      element.remove();
    }
    return;
  }

  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
};

export const updateJsonLd = (id: string, data: any): void => {
  if (typeof document === 'undefined') return;

  const scriptId = `jsonld-${id}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    if (script) {
      script.remove();
    }
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);

  if (script) {
    script.textContent = jsonString;
  } else {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = jsonString;
    document.head.appendChild(script);
  }
};

export const removeJsonLd = (id: string): void => {
  if (typeof document === 'undefined') return;
  const scriptId = `jsonld-${id}`;
  const script = document.getElementById(scriptId);
  if (script) {
    script.remove();
  }
};
