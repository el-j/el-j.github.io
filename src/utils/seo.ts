export const SITE = 'https://el-j.github.io';
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Fabian Althaus',
  alternateName: 'el-j',
  url: SITE,
  image: `${SITE}/og-image.png`,
  jobTitle: 'Fullstack UX/UI & Linux Engineer',
  description:
    'Fullstack engineer and UX/UI designer building web apps, design systems, developer tooling, embedded/hardware prototypes and multi-agent AI tools.',
  knowsAbout: [
    'Fullstack web development', 'TypeScript', 'Vue', 'Astro', 'UX/UI design', 'Design systems',
    'Linux', 'Command-line tools', 'Embedded systems', 'Multi-agent AI',
  ],
  sameAs: ['https://github.com/el-j', 'https://fabianalthaus.de'],
};

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE,
  name: 'Fabian Althaus (el-j)',
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.path, SITE).href,
    })),
  };
}

export function itemList(name: string, path: string, items: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE}${path}#page`,
    url: `${SITE}${path}`,
    name,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
    },
  };
}
