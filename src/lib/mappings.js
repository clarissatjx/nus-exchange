export const FACULTY_SHORT = {
  'College of Design and Engineering': 'CDE',
  'NUS Business School': 'Business',
  'Faculty of Arts & Social Sciences': 'FASS',
  'Faculty of Science': 'Science',
  'School of Computing': 'Computing',
  'Other Programmes': 'Other',
};

export const FACULTY_OPTIONS = ['All', ...Object.keys(FACULTY_SHORT)];

export function mappingKey(r) {
  return [r.partnerUni, r.nusCourse1, r.puCourse1, r.faculty].join('|||');
}

export function computeStats(records) {
  const unis = new Set(records.map((r) => r.partnerUni));
  const countries = new Set(records.map((r) => r.country));
  return { mappingCount: records.length, uniCount: unis.size, countryCount: countries.size };
}

export function groupByCountry(records) {
  const byCountry = new Map();
  for (const r of records) {
    if (!byCountry.has(r.country)) {
      byCountry.set(r.country, { country: r.country, unis: new Set(), count: 0 });
    }
    const entry = byCountry.get(r.country);
    entry.unis.add(r.partnerUni);
    entry.count += 1;
  }
  return [...byCountry.values()].sort((a, b) => b.count - a.count);
}

const PREFIX_RE = /^[A-Za-z&]+/;

export function coursePrefix(code) {
  const m = PREFIX_RE.exec(code || '');
  return m ? m[0].toUpperCase() : null;
}

export function groupPrefixes(records) {
  const counts = new Map();
  for (const r of records) {
    const prefix = coursePrefix(r.nusCourse1);
    if (!prefix) continue;
    counts.set(prefix, (counts.get(prefix) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([prefix, count]) => ({ prefix, count }));
}

export function groupUniversitiesByCountry(records) {
  const countries = groupByCountry(records);
  return countries.map((c) => {
    const uniCounts = new Map();
    for (const r of records) {
      if (r.country !== c.country) continue;
      uniCounts.set(r.partnerUni, (uniCounts.get(r.partnerUni) || 0) + 1);
    }
    const universities = [...uniCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
    return { country: c.country, universities };
  });
}

export function filterRecords(all, { query, faculty, country, uni, prefix }) {
  let recs = all;
  if (faculty && faculty !== 'All') recs = recs.filter((r) => r.faculty === faculty);
  if (country) recs = recs.filter((r) => r.country === country);
  if (uni) recs = recs.filter((r) => r.partnerUni === uni);
  if (prefix) recs = recs.filter((r) => coursePrefix(r.nusCourse1) === prefix);
  const q = (query || '').trim().toLowerCase();
  if (q) {
    recs = recs.filter(
      (r) =>
        (r.nusCourse1 || '').toLowerCase().includes(q) ||
        (r.nusCourse1Title || '').toLowerCase().includes(q) ||
        (r.nusCourse2 || '').toLowerCase().includes(q) ||
        (r.nusCourse2Title || '').toLowerCase().includes(q) ||
        (r.puCourse1 || '').toLowerCase().includes(q) ||
        (r.puCourse1Title || '').toLowerCase().includes(q) ||
        (r.puCourse2 || '').toLowerCase().includes(q) ||
        (r.puCourse2Title || '').toLowerCase().includes(q) ||
        (r.partnerUni || '').toLowerCase().includes(q),
    );
  }
  return recs;
}
