/**
 * Delivered projects shown in the "Our Work" section, in display order.
 *
 * Content is data so a project can be added, reworded or reordered without touching layout code.
 * Each `slug` matches a screenshot in `project-pictures/` (`<slug>.png`), which the image
 * pipeline converts to optimised formats; the source PNG is never served.
 */

/** One delivered project as presented on the site. */
export interface Project {
  /** Stable identifier, also the screenshot's file name. */
  slug: string;
  name: string;
  category: string;
  /** One or two sentences, written for a prospective client rather than an engineer. */
  summary: string;
  /** The main technologies only; a card has room for a handful. */
  stack: readonly string[];
  liveUrl: string;
}

export const projects: readonly Project[] = [
  {
    slug: 'aces-awards',
    name: 'ACES Awards',
    category: 'Enterprise Event Management',
    summary:
      'An event and seating platform for a high profile corporate awards night: seat allocation, guest invitations, seating charts and real time QR check-in.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL'],
    liveUrl: 'https://rsvp.morsgroup.com',
  },
  {
    slug: 'austin-haircut',
    name: 'Austin Haircuts',
    category: 'Directory Marketplace',
    summary:
      'An SEO focused marketplace connecting customers with local barbers and stylists, with a map based locator and instant SMS and email lead routing.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Twilio', 'Mapbox'],
    liveUrl: 'https://austin-haircuts.vercel.app/austin',
  },
  {
    slug: 'advisor-chooser',
    name: 'Advisor Chooser',
    category: 'B2B SaaS Platform',
    summary:
      'A two sided matchmaking platform that pairs business sellers with M&A advisors through a multi criteria matching engine and Stripe activation.',
    stack: ['React', 'NestJS', 'MongoDB', 'Stripe'],
    liveUrl: 'https://advisorchooser.com/',
  },
  {
    slug: 'cimamplify',
    name: 'CimAmplify',
    category: 'B2B SaaS Marketplace',
    summary:
      'A marketplace for the mergers and acquisitions industry where advisors list deals, match them with qualified buyers and manage introductions and documents.',
    stack: ['Next.js', 'NestJS', 'MongoDB', 'Socket.IO'],
    liveUrl: 'https://app.cimamplify.com',
  },
  {
    slug: 'wavestation',
    name: 'Wavestation',
    category: 'Business Management Software',
    summary:
      'A management platform for music industry teams to organise catalogue data, workflows, files, reporting and team access in one place.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL'],
    liveUrl: 'https://wavestation-frontend.vercel.app/login',
  },
  {
    slug: 'bloom-scholars',
    name: 'Bloom Scholars',
    category: 'Education and Coaching Platform',
    summary:
      'An education services platform with bookings, online payments, article publishing, newsletter capture and a role based admin dashboard.',
    stack: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Stripe'],
    liveUrl: 'https://bloomscholars.org',
  },
];
