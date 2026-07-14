import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchUniversitiesByCodes, parseModuleCodes } from '../lib/mappings.js';
import { useStarred } from '../hooks/StarredContext.jsx';

const STORAGE_KEY = 'nus-exchange-planned-codes';

function loadSavedCodes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ModulePlanMatcher({ records }) {
  const [codes, setCodes] = useState(loadSavedCodes);
  const [inputValue, setInputValue] = useState('');
  const { isStarred, starMany } = useStarred();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    } catch {
      // storage unavailable
    }
  }, [codes]);

  function addModule() {
    const toAdd = parseModuleCodes(inputValue);
    if (!toAdd.length) return;
    setCodes((prev) => [...new Set([...prev, ...toAdd])]);
    setInputValue('');
  }

  function removeModule(code) {
    setCodes((prev) => prev.filter((c) => c !== code));
  }

  const results = useMemo(
    () => (codes.length ? matchUniversitiesByCodes(records, codes) : []),
    [records, codes],
  );

  return (
    <div className="mb-9 rounded-2xl border border-border bg-white p-5">
      <div className="mb-1 text-[15px] font-bold">Find your best-fit university</div>
      <p className="mb-3 text-[13px] leading-relaxed text-muted">
        Add the NUS module codes you need to map for your exchange, and we'll rank partner
        universities by how many of them they cover.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addModule();
            }
          }}
          placeholder="e.g. CS2103"
          className="min-w-0 flex-1 rounded-[10px] border border-border-input bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={addModule}
          className="whitespace-nowrap rounded-[10px] bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-hover"
        >
          Add module
        </button>
      </div>

      {codes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {codes.map((c) => (
            <div
              key={c}
              className="flex items-center gap-1.5 rounded-full border border-border-input bg-bg px-3 py-1.5 text-[12.5px] font-semibold text-ink"
            >
              {c}
              <button
                type="button"
                onClick={() => removeModule(c)}
                aria-label={`Remove ${c}`}
                className="text-sm font-extrabold text-muted-3 hover:text-ink"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {codes.length > 0 && (
        <div className="mt-4">
          <div className="mb-2.5 text-[12.5px] text-muted-3">
            Matching {codes.length} module{codes.length === 1 ? '' : 's'}
            {results.length > 0 &&
              ` — top ${results.length} universit${results.length === 1 ? 'y' : 'ies'}`}
          </div>

          {results.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-3">
              No approved mappings found for these module codes yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((r, i) => {
                const allStarred = r.matchedRecords.every((rec) => isStarred(rec));
                return (
                  <div
                    key={r.partnerUni}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-[18px] py-[15px] hover:border-border-input max-sm:flex-col max-sm:items-start max-sm:gap-3"
                  >
                    <Link
                      to={`/search?uni=${encodeURIComponent(r.partnerUni)}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-bg text-[11px] font-bold text-accent-hover">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{r.partnerUni}</div>
                        <div className="mt-0.5 text-xs text-muted-3">{r.country}</div>
                        {r.missingCodes.length > 0 && (
                          <div className="mt-1 text-[11px] text-muted-3">
                            Missing: {r.missingCodes.join(', ')}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex flex-none items-center gap-3 max-sm:w-full max-sm:justify-between">
                      <div className="text-right">
                        <div className="text-sm font-bold text-accent">
                          {r.matchCount}/{codes.length}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-3">modules covered</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => starMany(r.matchedRecords)}
                        disabled={allStarred}
                        className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] font-semibold ${
                          allStarred
                            ? 'border-accent-border bg-accent-bg text-accent-hover'
                            : 'border-border-input text-muted hover:border-accent hover:text-accent'
                        }`}
                      >
                        {allStarred
                          ? `★ Starred (${r.matchedRecords.length})`
                          : `☆ Star all (${r.matchedRecords.length})`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
