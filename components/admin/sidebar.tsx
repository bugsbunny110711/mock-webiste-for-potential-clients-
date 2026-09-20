'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, PanelLeft } from 'lucide-react';
import { logout } from '@/lib/auth-actions';
import { navGroups } from './nav-items';
import styles from './sidebar.module.css';

export function Sidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);

  // Set on click so the indicator leaves immediately rather than waiting for
  // the route to resolve. Recording the path it was set from means it expires
  // by derivation as soon as the route changes — no effect needed to clear it,
  // and it cannot get stuck if a navigation is abandoned.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(
    null,
  );

  const activeHref =
    pending && pending.from === pathname ? pending.href : pathname;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const active = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;

    // Written straight to the DOM rather than held in state: this is the
    // component telling CSS where to draw, not data React needs to re-render on.
    nav.style.setProperty('--indicator-y', `${active.offsetTop}px`);
    nav.style.setProperty('--indicator-h', `${active.offsetHeight}px`);

    // Enables the transition only after the first position is known, so the
    // indicator does not slide in from the top on load.
    const frame = requestAnimationFrame(() => {
      nav.dataset.ready = 'true';
    });
    return () => cancelAnimationFrame(frame);
  }, [activeHref, isCollapsed]);

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      data-collapsed={isCollapsed}
    >
      <div className={styles.inner}>
        <Link href='/admin' className={styles.brand}>
          <span className={styles.brandMark} aria-hidden>
            ◎
          </span>
          <span className='font-display text-lg font-light'>Still Point</span>
        </Link>

        <button
          type='button'
          onClick={() => setIsCollapsed((value) => !value)}
          className={styles.collapseBtn}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          <PanelLeft size={18} />
        </button>

        <hr className={styles.divider} />

        <div className={styles.profile}>
          <span className={styles.avatar} aria-hidden>
            {name.charAt(0)}
          </span>
          <span className={styles.profileText}>
            <span className={styles.profileName}>{name}</span>
            <span className={styles.profileRole}>Coach</span>
          </span>
        </div>

        <ul className={styles.nav} ref={navRef}>
          <li className={styles.indicator} aria-hidden />

          {navGroups.map((group) => (
            <li key={group.heading}>
              <p className={styles.groupHeading}>{group.heading}</p>
              <ul className='m-0 list-none p-0'>
                {group.items.map((item) => {
                  const isActive = activeHref === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setPending({ href: item.href, from: pathname })}
                        data-active={isActive}
                        title={isCollapsed ? item.label : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={`${styles.row} ${isActive ? styles.active : ''}`}
                      >
                        <Icon aria-hidden />
                        <span className={styles.label}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <div className={styles.footerDivider} />
          <Link
            href='/'
            className={styles.row}
            title={isCollapsed ? 'View site' : undefined}
          >
            <PanelLeft aria-hidden className='rotate-180' />
            <span className={styles.label}>View site</span>
          </Link>
          <form action={logout}>
            <button
              type='submit'
              className={styles.row}
              title={isCollapsed ? 'Sign out' : undefined}
            >
              <LogOut aria-hidden />
              <span className={styles.label}>Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
