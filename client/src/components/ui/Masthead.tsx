import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

// `/#…` anchors work from every page: same-page jump on Home, full navigation elsewhere.
const NAV = [
  { index: '01', label: 'WORK', href: '/#work' },
  { index: '02', label: 'EXPERIENCE', href: '/#experience' },
  { index: '03', label: 'RESEARCH', href: '/#research' },
  { index: '04', label: 'DISPATCHES', to: '/dispatches' },
  { index: '05', label: 'NOW', to: '/now' },
  { index: '06', label: 'CONTACT', href: '/#contact' },
];

function NavItem({
  item,
  className,
  onClick,
}: {
  item: (typeof NAV)[number];
  className: string;
  onClick?: () => void;
}) {
  const label = `[${item.index}] ${item.label}`;
  return item.to ? (
    <Link to={item.to} className={className} onClick={onClick}>
      {label}
    </Link>
  ) : (
    <a href={item.href} className={className} onClick={onClick}>
      {label}
    </a>
  );
}

function formatIST(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function readStoredTheme(): 'dark' | 'light' {
  try {
    return (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
  } catch {
    return 'dark';
  }
}

export function Masthead({ availableForWork }: { availableForWork: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(() => formatIST(new Date()));
  const [theme, setTheme] = useState<'dark' | 'light'>(readStoredTheme);

  useEffect(() => {
    const id = setInterval(() => setTime(formatIST(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // private browsing / storage blocked — theme just won't persist
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-bg">
      <div className="mx-auto flex h-14 max-w-[1360px] items-center justify-between px-4 font-mono text-[12px] uppercase tracking-wide sm:px-6">
        <Link to="/" className="font-semibold text-ink">
          SHAN.DEV
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV.map((item) => (
            <NavItem
              key={item.index}
              item={item}
              className="text-ink-dim transition-colors hover:text-acid-hover"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="flex items-center gap-1.5 text-ink-dim">
            <span className={cn('h-1.5 w-1.5', availableForWork ? 'bg-acid' : 'bg-ink-mute')} />
            {availableForWork ? 'OPEN TO WORK' : 'HEADS DOWN'}
          </span>
          <span className="text-ink-mute">IST {time}</span>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle theme"
            className="text-ink-dim hover:text-acid-hover"
          >
            [◐]
          </button>
        </div>

        <button
          type="button"
          className="text-ink xl:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
        >
          [≡ MENU]
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t-2 border-line bg-bg px-4 py-4 xl:hidden">
          {NAV.map((item) => (
            <NavItem
              key={item.index}
              item={item}
              className="block py-2 font-mono text-sm text-ink-dim hover:text-acid-hover"
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      )}
    </header>
  );
}
