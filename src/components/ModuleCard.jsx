export default function ModuleCard({ label, courses }) {
  return (
    <div className="flex-1 min-w-[220px] rounded-2xl border border-border bg-white p-[22px]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-3">
        {label}
        {courses.length > 1 ? ' (combined)' : ''}
      </div>
      <div className="flex flex-col gap-3">
        {courses.map((c, i) => (
          <div key={c.code}>
            {i > 0 && <div className="mb-3 text-xs font-bold text-muted-3">+</div>}
            <div className="text-[19px] font-extrabold text-ink">{c.code}</div>
            <div className="mt-1 text-sm leading-snug text-[#4a453d]">{c.title}</div>
            <div className="mt-1 text-[12.5px] text-muted-2">{c.units} units</div>
          </div>
        ))}
      </div>
    </div>
  );
}
