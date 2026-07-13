import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { computeStats, groupUniversitiesByCountry } from '../lib/mappings.js';
import Loading from '../components/Loading.jsx';

export default function Browse() {
  const { records, loading } = useMappings();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';

  const stats = useMemo(() => (records ? computeStats(records) : null), [records]);
  const groups = useMemo(
    () => (records ? groupUniversitiesByCountry(records) : []),
    [records],
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => {
        const countryMatches = g.country.toLowerCase().includes(q);
        const universities = countryMatches
          ? g.universities
          : g.universities.filter((u) => u.name.toLowerCase().includes(q));
        return { ...g, universities };
      })
      .filter((g) => g.universities.length > 0);
  }, [groups, query]);

  const matchCount = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.universities.length, 0),
    [filteredGroups],
  );

  function updateQuery(value) {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    setParams(next, { replace: true });
  }

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-16 pt-12 max-sm:px-4">
      <h1 className="mb-1.5 text-[28px] font-extrabold tracking-tight">Partner universities</h1>
      <p className="mb-6 text-sm text-muted">
        {stats.uniCount} universities across {stats.countryCount} countries with approved module
        mappings.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        placeholder="Search universities or countries"
        className="w-full rounded-[10px] border border-border-input bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
      />

      {query && (
        <div className="my-2.5 text-[12.5px] text-muted-3">
          {matchCount} universit{matchCount === 1 ? 'y' : 'ies'} found
        </div>
      )}

      {filteredGroups.length === 0 ? (
        <div className="px-5 py-[60px] text-center text-sm text-muted-3">
          No universities found. Try a different search.
        </div>
      ) : (
        <div className={`flex flex-col gap-8 ${query ? '' : 'mt-9'}`}>
          {filteredGroups.map((g) => (
            <div key={g.country}>
              <div className="mb-2.5 text-[13px] font-bold uppercase tracking-wide text-muted-2">
                {g.country}
              </div>
              <div className="flex flex-col gap-2">
                {g.universities.map((u) => (
                  <button
                    key={u.name}
                    type="button"
                    onClick={() => navigate(`/search?uni=${encodeURIComponent(u.name)}`)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-[18px] py-[15px] text-left hover:border-border-input max-sm:flex-col max-sm:items-start max-sm:gap-1"
                  >
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="whitespace-nowrap text-[12.5px] text-muted-3">
                      {u.count} mapping{u.count === 1 ? '' : 's'} →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
