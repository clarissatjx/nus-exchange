import { NavLink } from 'react-router-dom';
import { useStarred } from '../hooks/StarredContext.jsx';

const navLinkClass = ({ isActive }) =>
  `text-[13.5px] max-sm:flex-1 max-sm:py-1 max-sm:text-center max-sm:text-[12px] ${
    isActive ? 'font-bold text-ink' : 'font-normal text-muted'
  }`;

export default function Header() {
  const { starredCount } = useStarred();

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-bg/92 px-10 py-[18px] backdrop-blur-sm max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:items-start max-sm:gap-y-0 max-sm:px-[18px] max-sm:pb-0 max-sm:pt-3.5">
      <div className="flex flex-wrap items-center gap-11 max-sm:contents">
        <NavLink to="/" className="text-[17px] font-extrabold tracking-tight text-ink">
          exchange<span className="text-accent">.map</span>
        </NavLink>
        <nav className="flex flex-wrap gap-7 max-sm:col-span-2 max-sm:mt-3 max-sm:-mx-[18px] max-sm:gap-1 max-sm:border-t max-sm:border-border max-sm:px-[18px] max-sm:py-3">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/search" className={navLinkClass}>Search</NavLink>
          <NavLink to="/universities" className={navLinkClass}>Universities</NavLink>
          <NavLink to="/mappings" className={navLinkClass}>
            <span className="max-sm:hidden">
              My Mappings{starredCount ? ` (${starredCount})` : ''}
            </span>
            <span className="hidden max-sm:inline">
              Saved{starredCount ? ` (${starredCount})` : ''}
            </span>
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4 max-sm:contents">
        <div className="text-xs text-muted-3 max-sm:hidden">for NUS students on exchange</div>
        <a
          href="https://github.com/clarissatjx/nus-exchange"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="text-muted-2 hover:text-ink max-sm:col-start-2 max-sm:row-start-1"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
              -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
              .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
              -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
              1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
              1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
              1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
