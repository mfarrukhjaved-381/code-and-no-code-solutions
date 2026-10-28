/**
 * Brand facts and contact details used across the site.
 *
 * Kept as data rather than written into components so a wording change (the brand name has
 * already changed once) is a one-line edit with no layout code touched.
 */
export const site = {
  name: 'Code and No Code Solutions',
  shortName: 'CN',
  parentCompany: 'Mercury Sols',
  parentUrl: 'https://mercurysols.org/',
  tagline:
    'We build with code and without it: web and mobile apps, AI automation and integrations, shipped fast and built to last.',
  contact: {
    // The team lead's direct contact details; WhatsApp is on the same number.
    email: 'mateenikhtiyar8@gmail.com',
    phoneDisplay: '+92 304 3498395',
    phoneHref: 'tel:+923043498395',
    whatsappHref: 'https://wa.me/923043498395',
  },
} as const;

/** Page sections in the bottom navigation, in page order. Ids match the section elements. */
export const navLinks = [
  { id: 'top', label: 'Home' },
  { id: 'team', label: 'Team' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;
