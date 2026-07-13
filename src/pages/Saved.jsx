import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { useStarred } from '../hooks/StarredContext.jsx';
import ResultCard from '../components/ResultCard.jsx';
import Loading from '../components/Loading.jsx';

export default function Saved() {
  const { records, loading } = useMappings();
  const { isStarred } = useStarred();
  const navigate = useNavigate();

  const savedResults = useMemo(
    () => (records ? records.filter((r) => isStarred(r)) : []),
    [records, isStarred],
  );

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-16 pt-12 max-sm:px-4">
      <h1 className="mb-1.5 text-[28px] font-extrabold tracking-tight">My mappings</h1>
      <p className="mb-[30px] text-sm text-muted">Mappings you've starred, saved on this device.</p>

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
