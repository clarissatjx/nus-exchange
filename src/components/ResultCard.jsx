import { Link } from 'react-router-dom';
import { useStarred } from '../hooks/StarredContext.jsx';

export default function ResultCard({ record }) {
  const { isStarred, toggleStar } = useStarred();
  const starred = isStarred(record);

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border bg-white py-4 px-[18px]">
      <Link
        to={`/mappings/${record._idx}`}
        className="flex min-w-0 flex-1 items-center gap-[18px] max-sm:flex-col max-sm:items-start max-sm:gap-2"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[13.5px] font-bold text-ink">{record.nusCourse1}</span>
            {record.nusCourse2 && (
              <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[10px] font-bold text-accent-hover">
                +1 NUS mod
              </span>
            )}
            <span className="text-[13px] text-muted">{record.nusCourse1Title}</span>
          </div>
          <div className="mt-1 text-xs text-muted-3">{record.nusCrse1Units} NUS units</div>
        </div>
        <div className="flex-none text-[15px] text-border-input max-sm:hidden">⇄</div>
        <div className="min-w-0 flex-1 text-right max-sm:text-left">
          <div className="flex flex-wrap items-baseline justify-end gap-2 max-sm:justify-start">
            <span className="text-[13px] text-muted">{record.puCourse1Title}</span>
            {record.puCourse2 && (
              <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[10px] font-bold text-accent-hover">
                +1 overseas mod
              </span>
            )}
            <span className="text-[13.5px] font-bold text-ink">{record.puCourse1}</span>
          </div>
          <div className="mt-1 text-xs text-muted-3">
            {record.partnerUni} · {record.country}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleStar(record)}
        aria-label="Toggle saved"
        className="flex-none p-1 text-lg"
        style={{ color: starred ? 'var(--color-accent)' : 'var(--color-border-input)' }}
      >
        {starred ? '★' : '☆'}
      </button>
    </div>
  );
}
