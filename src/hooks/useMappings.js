import { useEffect, useState } from 'react';

let cache = null;

export function useMappings() {
  const [records, setRecords] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    fetch('/modules-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        cache = data.map((r, i) => ({ ...r, _idx: i }));
        setRecords(cache);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { records, loading: !records && !error, error };
}
