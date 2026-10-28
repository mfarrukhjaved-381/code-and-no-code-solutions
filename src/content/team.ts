/**
 * The team, in the order the galaxy journey visits them.
 *
 * Order is the source of truth for the scroll story: the first entry is shown first, with the
 * crown. Reordering or adding a person is an edit here only; the DOM cards, the person navigator
 * and the 3D star positions all derive from this array.
 */

/** Distinguishes the team lead, who gets the crown and the gold star, from other members. */
export type MemberRank = 'lead' | 'member';

/** One team member as presented on the site. */
export interface TeamMember {
  /** Stable identifier: the card's element id and the portrait's file name. */
  id: string;
  name: string;
  title: string;
  rank: MemberRank;
  bio: string;
  skills: readonly string[];
  /** Portrait dimensions, so the browser reserves space before the image loads (no layout shift). */
  photo: { width: number; height: number };
}

export const team: readonly TeamMember[] = [
  {
    id: 'mateen-ikhtiar',
    name: 'Mateen Ikhtiar',
    title: 'Team Lead',
    rank: 'lead',
    bio: 'Leads Code and No Code Solutions, from the first client call to launch day, keeping every project focused, on scope and on time.',
    skills: ['Technical Leadership', 'Delivery', 'Client Strategy', 'Full Stack'],
    photo: { width: 600, height: 800 },
  },
  {
    id: 'muhammad-tayyab',
    name: 'Muhammad Tayyab',
    title: 'Principal Engineer, Code and No Code',
    rank: 'member',
    bio: 'Equally at home in hand written code and no code platforms, he picks whichever ships the product fastest and lasts the longest.',
    skills: ['Full Stack', 'No Code Platforms', 'Automation', 'Solution Design'],
    photo: { width: 384, height: 512 },
  },
  {
    id: 'rizwan-ahmed',
    name: 'Rizwan Ahmed',
    title: 'Full Stack Engineer, Web and Mobile',
    rank: 'member',
    bio: 'Builds web and mobile apps end to end, from the interface to the API, with a sharp eye for speed and detail.',
    skills: ['React', 'React Native', 'Node.js', 'REST APIs'],
    photo: { width: 600, height: 800 },
  },
  {
    id: 'muhammad-farrukh-javed',
    name: 'Muhammad Farrukh Javed',
    title: 'Software Architect',
    rank: 'member',
    bio: 'Designs the systems behind the products: architecture, backend services and data models that stay fast and reliable as they grow.',
    skills: ['System Design', 'Backend', 'NestJS', 'PostgreSQL'],
    photo: { width: 600, height: 800 },
  },
];
