import {
  BarChart3,
  Calendar,
  Camera,
  Clock,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Receipt,
  Tent,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };

/** One list, shared by the sidebar and the narrow-screen nav, so they cannot drift. */
export const navGroups: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Running the week',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutGrid },
      { href: '/admin/calendar', label: 'Master calendar', icon: Calendar },
      { href: '/admin/bookings', label: 'Orders & bookings', icon: Receipt },
      { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
      { href: '/admin/students', label: 'People', icon: Users },
    ],
  },
  {
    heading: 'The business',
    items: [
      { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
      { href: '/admin/retreats', label: 'Retreats', icon: Tent },
      { href: '/admin/audience', label: 'Audience', icon: BarChart3 },
      { href: '/admin/availability', label: 'Availability', icon: Clock },
      { href: '/admin/photos', label: 'Photo shot list', icon: Camera },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);
