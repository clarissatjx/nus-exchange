import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { computeStats, groupByCountry } from '../lib/mappings.js';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const { records, loading } = useMappings();
  const [homeQuery, setHomeQuery] = useState('');
  const navigate = useNavigate();

  const stats = useMemo(() => (records ? computeStats(records) : null), [records]);
  const topCountries = useMemo(
    () => (records ? groupByCountry(records).slice(0, 6) : []),
    [records],
  );

  function submitSearch() {
    const params = homeQuery.trim() ? `?q=${encodeURIComponent(homeQuery.trim())}` : '';
    navigate(`/search${params}`);
  }

  if (loading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-16 pt-[88px] max-sm:px-4 max-sm:pb-12 max-sm:pt-14">
      <div className="flex w-full max-w-[640px] flex-col items-center gap-[22px] text-center">
        <div className="text-[13px] font-bold uppercase tracking-wide text-accent">
          For NUS students on exchange
        </div>
        <h1 className="text-[46px] font-extrabold leading-[1.06] tracking-tight max-sm:text-[32px]">
          Find out which modules
          <br />
          actually transfer back.
        </h1>
        <p className="max-w-[460px] text-base leading-relaxed text-muted">
          Search real, previously-approved module mappings across partner universities — before
          you plan your exchange application.
        </p>

        <div className="mt-3.5 flex w-full max-w-[520px] gap-2.5">
          <input
            type="text"
            value={homeQuery}
            onChange={(e) => setHomeQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
            placeholder="Try a course code, e.g. CS2103, or a university"
            className="flex-1 rounded-[10px] border border-border-input bg-white px-4 py-3.5 text-sm text-ink shadow-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={submitSearch}
            className="whitespace-nowrap rounded-[10px] bg-accent px-[26px] py-3.5 text-sm font-bold text-white hover:bg-accent-hover"
          >
            Search
          </button>
        </div>

        <div className="mt-[30px] flex w-full max-w-[520px] flex-wrap gap-3.5">
          <StatCard num={stats.mappingCount.toLocaleString()} label="module mappings" />
          <StatCard num={stats.uniCount} label="partner universities" />
          <StatCard num={stats.countryCount} label="countries" />
        </div>
      </div>

      <div className="mt-[76px] flex w-full max-w-[900px] flex-col gap-[18px]">
        <div className="flex items-baseline justify-between">
          <div className="text-[15px] font-bold">Browse by destination</div>
          <button
            type="button"
            onClick={() => navigate('/universities')}
            className="text-[13px] font-semibold text-accent hover:text-accent-hover"
          >
            See all universities →
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {topCountries.map((c) => (
            <button
              key={c.country}
              type="button"
              onClick={() => navigate(`/search?country=${encodeURIComponent(c.country)}`)}
              className="min-w-[140px] rounded-xl border border-border bg-white px-[18px] py-3.5 text-left hover:border-border-input"
            >
              <div className="text-sm font-bold">{c.country}</div>
              <div className="mt-0.5 text-xs text-muted-2">
                {c.unis.size} universities · {c.count} mappings
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ num, label }) {
  return (
    <div className="min-w-[120px] flex-1 rounded-2xl border border-border bg-white p-5">
      <div className="text-[26px] font-extrabold text-accent">{num}</div>
      <div className="mt-0.5 text-xs text-muted-2">{label}</div>
    </div>
  );
}
