import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { computeStats, groupUniversitiesByCountry } from '../lib/mappings.js';
import Loading from '../components/Loading.jsx';

export default function Browse() {
  const { records, loading } = useMappings();
  const navigate = useNavigate();

  const stats = useMemo(() => (records ? computeStats(records) : null), [records]);
  const groups = useMemo(
    () => (records ? groupUniversitiesByCountry(records) : []),
    [records],
  );

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-16 pt-12 max-sm:px-4">
      <h1 className="mb-1.5 text-[28px] font-extrabold tracking-tight">Partner universities</h1>
      <p className="mb-9 text-sm text-muted">
        {stats.uniCount} universities across {stats.countryCount} countries with approved module
        mappings.
      </p>

      <div className="flex flex-col gap-8">
        {groups.map((g) => (
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
                  className="flex items-center justify-between rounded-xl border border-border bg-white px-[18px] py-[15px] text-left hover:border-border-input"
                >
                  <div className="text-sm font-semibold">{u.name}</div>
                  <div className="text-[12.5px] text-muted-3">
                    {u.count} mapping{u.count === 1 ? '' : 's'} →
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
