import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { useStarred } from '../hooks/StarredContext.jsx';
import ResultCard from '../components/ResultCard.jsx';
import ModulePlanMatcher from '../components/ModulePlanMatcher.jsx';
import Loading from '../components/Loading.jsx';

const SORT_OPTIONS = [
  { key: 'university', label: 'University' },
  { key: 'module', label: 'Module code' },
];

export default function Saved() {
  const { records, loading } = useMappings();
  const { isStarred } = useStarred();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('university');

  const savedResults = useMemo(() => {
    if (!records) return [];
    const starred = records.filter((r) => isStarred(r));
    return starred.sort((a, b) =>
      sortBy === 'module'
        ? a.nusCourse1.localeCompare(b.nusCourse1) || a.partnerUni.localeCompare(b.partnerUni)
        : a.partnerUni.localeCompare(b.partnerUni) || a.nusCourse1.localeCompare(b.nusCourse1),
    );
  }, [records, isStarred, sortBy]);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-16 pt-12 max-sm:px-4">
      <h1 className="mb-1.5 text-[28px] font-extrabold tracking-tight">My mappings</h1>
      <p className="mb-[30px] text-sm text-muted">Mappings you've starred, saved on this device.</p>

      <ModulePlanMatcher records={records} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[15px] font-bold">Starred mappings</div>
        {savedResults.length > 0 && (
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted-2">
            <span className="mr-0.5">Sort by:</span>
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${
                    active
                      ? 'border-ink bg-ink text-white'
                      : 'border-border bg-white text-muted hover:border-border-input'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        {savedResults.length ? (
          savedResults.map((r) => <ResultCard key={r._idx} record={r} />)
        ) : (
          <div className="flex flex-col items-center gap-3.5 px-5 py-20 text-center text-sm text-muted-3">
            <div className="text-[28px]">☆</div>
            <div>No mappings saved yet. Star a mapping from search results to plan your exchange here.</div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="font-semibold text-accent hover:text-accent-hover"
            >
              Browse mappings →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
