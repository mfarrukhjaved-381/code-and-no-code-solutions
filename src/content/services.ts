/**
 * Services the unit offers, in display order. Wording follows the Mercury Sols service lines,
 * narrowed to what this unit delivers.
 */

/** One service offering. */
export interface Service {
  id: string;
  name: string;
  summary: string;
}

export const services: readonly Service[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    summary:
      'Fast production web platforms and SaaS products, built on React, Next.js and Node.js.',
  },
  {
    id: 'mobile-apps',
    name: 'Mobile App Development',
    summary:
      'iOS and Android apps, cross platform with React Native or Flutter, released to the stores end to end.',
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    summary: 'AI agents, copilots and workflow automation that take repetitive work off your team.',
  },
  {
    id: 'integrations',
    name: 'Integrations',
    summary: 'Payments, CRMs, messaging and third party APIs connected into one reliable flow.',
  },
  {
    id: 'no-code',
    name: 'No Code Solutions',
    summary: 'Products and internal tools on no code platforms, when speed to market matters most.',
  },
  {
    id: 'architecture',
    name: 'System Architecture',
    summary:
      'System design, backend architecture and technical reviews that keep products fast as they scale.',
  },
];
