import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mappingKey } from '../lib/mappings.js';

const STAR_KEY = 'nus-exchange-starred-mappings';
const StarredContext = createContext(null);

function loadStarred() {
  try {
    const raw = window.localStorage.getItem(STAR_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function StarredProvider({ children }) {
  const [starred, setStarred] = useState(loadStarred);

  const toggleStar = useCallback((record) => {
    setStarred((prev) => {
      const key = mappingKey(record);
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      try {
        window.localStorage.setItem(STAR_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  const isStarred = useCallback((record) => !!starred[mappingKey(record)], [starred]);

  const value = useMemo(
    () => ({ starred, isStarred, toggleStar, starredCount: Object.keys(starred).length }),
    [starred, isStarred, toggleStar],
  );

  return <StarredContext.Provider value={value}>{children}</StarredContext.Provider>;
}

export function useStarred() {
  const ctx = useContext(StarredContext);
  if (!ctx) throw new Error('useStarred must be used within StarredProvider');
  return ctx;
}
