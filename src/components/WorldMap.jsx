import { useEffect, useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { COUNTRY_CONTINENT } from '../lib/continents.js';

const WIDTH = 900;
const HEIGHT = 420;
const EXCLUDED = new Set(['Antarctica', 'Fr. S. Antarctic Lands']);

let cache = null;

export default function WorldMap({ activeContinent, continentsWithData, onSelectContinent }) {
  const [features, setFeatures] = useState(cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((topo) => {
        if (cancelled) return;
        const geo = feature(topo, topo.objects.countries);
        cache = geo.features.filter((f) => !EXCLUDED.has(f.properties.name));
        setFeatures(cache);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const path = useMemo(() => {
    if (!features) return null;
    const projection = geoNaturalEarth1().fitSize(
      [WIDTH, HEIGHT],
      { type: 'FeatureCollection', features },
    );
    return geoPath(projection);
  }, [features]);

  if (!features || !path) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-3">
        Loading map…
      </div>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="World map — click a continent to filter partner universities"
      >
        {features.map((f) => {
          const continent = COUNTRY_CONTINENT[f.properties.name] || null;
          const hasData = continent && continentsWithData.has(continent);
          const isActive = continent && continent === activeContinent;
          const d = path(f);
          if (!d) return null;
          return (
            <path
              key={f.properties.name}
              d={d}
              onClick={hasData ? () => onSelectContinent(continent) : undefined}
              strokeWidth={0.75}
              className={
                isActive
                  ? 'fill-accent stroke-bg'
                  : hasData
                    ? 'cursor-pointer fill-border-input stroke-bg transition-colors hover:fill-accent/60'
                    : 'fill-border stroke-bg'
              }
            >
              {hasData && <title>{continent}</title>}
            </path>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[12.5px] text-muted-3">
        <span>Click a continent to filter</span>
        {activeContinent && (
          <button
            type="button"
            onClick={() => onSelectContinent(activeContinent)}
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Clear ({activeContinent}) ×
          </button>
        )}
      </div>
    </div>
  );
}
