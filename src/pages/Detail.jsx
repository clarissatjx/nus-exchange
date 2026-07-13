import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMappings } from '../hooks/useMappings.js';
import { useStarred } from '../hooks/StarredContext.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import Loading from '../components/Loading.jsx';

export default function Detail() {
  const { idx } = useParams();
  const { records, loading } = useMappings();
  const { isStarred, toggleStar } = useStarred();
  const navigate = useNavigate();

  const rec = useMemo(
    () => (records ? records.find((r) => r._idx === Number(idx)) : null),
    [records, idx],
  );
  const relatedAll = useMemo(
    () =>
      records && rec
        ? records.filter((r) => r.partnerUni === rec.partnerUni && r._idx !== rec._idx)
        : [],
    [records, rec],
  );
  const related = relatedAll.slice(0, 6);

  if (loading) return <Loading />;

  if (!rec) {
    return (
      <div className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-10">
        <div className="px-5 py-[60px] text-center text-sm text-muted-3">
          Mapping not found.{' '}
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Back to search
          </button>
        </div>
      </div>
    );
  }

  const starred = isStarred(rec);

  const nusCourses = [
    { code: rec.nusCourse1, title: rec.nusCourse1Title, units: rec.nusCrse1Units },
    ...(rec.nusCourse2
      ? [{ code: rec.nusCourse2, title: rec.nusCourse2Title, units: rec.nusCrse2Units }]
      : []),
  ];
  const puCourses = [
    { code: rec.puCourse1, title: rec.puCourse1Title, units: rec.puCrse1Units },
    ...(rec.puCourse2
      ? [{ code: rec.puCourse2, title: rec.puCourse2Title, units: rec.puCrse2Units }]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-10 max-sm:px-4">
      <div className="mb-[22px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[13px] font-semibold text-muted-2 hover:text-ink"
        >
          ← Back to results
        </button>
        <button
          type="button"
          onClick={() => toggleStar(rec)}
          className="flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: starred ? 'var(--color-accent)' : 'var(--color-muted-3)' }}
        >
          <span className="text-lg">{starred ? '★' : '☆'}</span>
          {starred ? 'Saved to My Mappings' : 'Save to My Mappings'}
        </button>
      </div>

      <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
        <div className="rounded-full bg-accent-bg px-[11px] py-[5px] text-xs font-bold text-accent-hover">
          {rec.faculty}
        </div>
        <div className="text-[13px] text-muted">
          {rec.partnerUni} · {rec.country}
        </div>
      </div>

      {(puCourses.length > 1 || nusCourses.length > 1) && (
        <div className="mb-3.5 text-[12.5px] text-muted-2">
          {puCourses.length > 1
            ? `These ${puCourses.length} overseas modules together map to this NUS module.`
            : `This overseas module maps to these ${nusCourses.length} NUS modules.`}
        </div>
      )}

      <div className="flex items-stretch gap-5 max-sm:flex-col">
        <ModuleCard label="NUS module" courses={nusCourses} />
        <div className="flex flex-none items-center justify-center self-center text-xl text-border-input max-sm:rotate-90">
          ⇄
        </div>
        <ModuleCard label="Overseas module" courses={puCourses} />
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div className="text-sm font-bold">Other approved mappings at {rec.partnerUni}</div>
          {relatedAll.length > 0 && (
            <button
              type="button"
              onClick={() => navigate(`/search?uni=${encodeURIComponent(rec.partnerUni)}`)}
              className="flex-none text-[13px] font-semibold text-accent hover:text-accent-hover"
            >
              See all {relatedAll.length + 1} mappings →
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {related.length ? (
            related.map((rel) => (
              <Link
                key={rel._idx}
                to={`/mappings/${rel._idx}`}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-white px-4 py-3 hover:border-border-input"
              >
                <div className="text-[13px] font-semibold">
                  {rel.nusCourse1} · {rel.nusCourse1Title}
                </div>
                <div className="flex-none text-xs text-muted-3">{rel.puCourse1}</div>
              </Link>
            ))
          ) : (
            <div className="py-2 text-center text-[12.5px] text-muted-3">
              No other mappings on file for this university yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
