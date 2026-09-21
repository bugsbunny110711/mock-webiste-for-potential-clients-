import {
  BookOpen,
  GraduationCap,
  HomeIcon,
  Mail,
  Mountain,
  UserCircle2,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export type SiteNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

/**
 * The public navigation, in order.
 *
 * Shared by the two shapes it takes: the horizontal bar on a desktop and the
 * drop-down panel below 1120px. One list so the two can never disagree about
 * what the site contains.
 *
 * Booking is deliberately not here. It is the thing the site sells, so it is
 * drawn separately in both and never as another equal row.
 */
export const siteNavItems: SiteNavItem[] = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Courses', href: '/courses', icon: GraduationCap },
  { title: 'Retreats', href: '/retreats', icon: Mountain },
  { title: 'Journal', href: '/journal', icon: BookOpen },
  { title: 'About', href: '/about', icon: UserRound },
  { title: 'Contact', href: '/contact', icon: Mail },
  { title: 'Account', href: '/account', icon: UserCircle2 },
];

/** True when `href` is the page currently being viewed. */
export function isActiveHref(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
