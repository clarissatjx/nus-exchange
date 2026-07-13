import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { FACULTY_OPTIONS, FACULTY_SHORT, filterRecords, groupPrefixes } from '../lib/mappings.js';
import ResultCard from '../components/ResultCard.jsx';
import Loading from '../components/Loading.jsx';

const PAGE_SIZE = 100;
const PREFIX_COLLAPSE_COUNT = 8;

export default function Search() {
  const { records, loading } = useMappings();
  const [params, setParams] = useSearchParams();

  const query = params.get('q') || '';
  const faculty = params.get('faculty') || 'All';
  const country = params.get('country') || '';
  const uni = params.get('uni') || '';
  const prefix = params.get('prefix') || '';

  const facultyScoped = useMemo(
    () => (records ? filterRecords(records, { faculty, country, uni }) : []),
    [records, faculty, country, uni],
  );
  const prefixOptions = useMemo(() => groupPrefixes(facultyScoped), [facultyScoped]);

  const [showAllPrefixes, setShowAllPrefixes] = useState(false);
  useEffect(() => setShowAllPrefixes(false), [faculty]);
  const visiblePrefixes = showAllPrefixes
    ? prefixOptions
    : prefixOptions.slice(0, PREFIX_COLLAPSE_COUNT);

  const filtered = useMemo(
    () => filterRecords(facultyScoped, { query, prefix }),
    [facultyScoped, query, prefix],
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => setVisibleCount(PAGE_SIZE), [query, faculty, country, uni, prefix]);
  const results = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => v + PAGE_SIZE);
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function setFaculty(f) {
    const next = new URLSearchParams(params);
    if (f === 'All') next.delete('faculty');
    else next.set('faculty', f);
    next.delete('prefix');
    setParams(next, { replace: true });
  }

  function togglePrefix(p) {
    updateParam('prefix', prefix === p ? '' : p);
  }

  function clearLocation() {
    const next = new URLSearchParams(params);
    next.delete('country');
    next.delete('uni');
    setParams(next, { replace: true });
  }

  if (loading) return <Loading />;

  const locLabel = uni || country;

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-16 pt-10 max-sm:px-4">
      <div className="mb-[18px] flex gap-2.5">
        <input
          type="text"
          value={query}
          onChange={(e) => updateParam('q', e.target.value)}
          placeholder="Search NUS course code, module title, or university"
          className="min-w-0 flex-1 rounded-[10px] border border-border-input bg-white px-4 py-[13px] text-sm text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2.5">
        <div className="mr-1 text-xs text-muted-2">Faculty:</div>
        {FACULTY_OPTIONS.map((f) => {
          const active = faculty === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFaculty(f)}
              className={`rounded-full border px-[13px] py-1.5 text-[12.5px] font-semibold ${
                active
                  ? 'border-ink bg-ink text-white'
                  : 'border-border bg-white text-muted'
              }`}
            >
              {f === 'All' ? 'All' : FACULTY_SHORT[f]}
            </button>
          );
        })}

        {locLabel && (
          <>
            <div className="mx-1.5 h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-bg px-[13px] py-1.5 text-[12.5px] font-semibold text-accent-hover">
              {locLabel}
              <button type="button" onClick={clearLocation} className="text-sm font-extrabold">
                ×
              </button>
            </div>
          </>
        )}
      </div>

      {faculty !== 'All' && prefixOptions.length > 0 && (
        <div className="mb-3 rounded-xl border border-border bg-white/60 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wide text-muted-2">
              Filter by module prefix
            </div>
            {prefix && (
              <button
                type="button"
                onClick={() => togglePrefix(prefix)}
                className="text-[11.5px] font-semibold text-accent hover:text-accent-hover"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visiblePrefixes.map(({ prefix: p, count }) => {
              const active = prefix === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePrefix(p)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                    active
                      ? 'border-accent-border bg-accent-bg text-accent-hover'
                      : 'border-border bg-white text-muted hover:border-border-input'
                  }`}
                >
                  {p}
                  <span className={active ? 'text-accent-hover/70' : 'text-muted-3'}>{count}</span>
                </button>
              );
            })}
            {prefixOptions.length > PREFIX_COLLAPSE_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllPrefixes((v) => !v)}
                className="rounded-full border border-dashed border-border-input px-3 py-1.5 text-[12px] font-semibold text-muted-2 hover:text-ink"
              >
                {showAllPrefixes ? 'Show less' : `+${prefixOptions.length - PREFIX_COLLAPSE_COUNT} more`}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="my-2.5 text-[12.5px] text-muted-3">
        {filtered.length} mapping{filtered.length === 1 ? '' : 's'} found
      </div>

      <div className="flex flex-col gap-2.5">
        {results.length ? (
          results.map((r) => <ResultCard key={r._idx} record={r} />)
        ) : (
          <div className="px-5 py-[60px] text-center text-sm text-muted-3">
            No mappings found. Try a different course code or clear your filters.
          </div>
        )}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="py-6 text-center text-[12.5px] text-muted-3">
          Loading more mappings…
        </div>
      )}
    </div>
  );
}
