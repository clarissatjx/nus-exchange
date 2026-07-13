# exchange.map

website to help students map mods for exchange bc edurec SUCKSSSS

Search real, previously-approved NUS exchange module mappings across partner universities
before you plan your application — 16,000+ mappings across 360 partner universities in 44
countries.

## Features

- **Search** by NUS course code, module title, or university, with faculty and NUS
  module-prefix filters (e.g. `EE`, `ME`, `CS`), all reflected in the URL so results are
  shareable/bookmarkable.
- **Browse** partner universities grouped by country.
- **Detail view** for each mapping, correctly showing combined mappings (e.g. two overseas
  modules bundling into one NUS module, or vice versa) rather than implying two separate 1:1
  pairs.
- **My Mappings** — star mappings to save them, persisted in `localStorage`.
- Infinite scroll on search results (loads 100 at a time).

## Tech stack

React 19 + Vite + React Router + Tailwind CSS v4. No backend — it's a static site that fetches
a pre-built JSON dataset at runtime.

## Getting started

```
npm install
npm run dev       # dev server
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  pages/       Home, Search, Browse, Saved, Detail — one per route
  components/  Header, ResultCard, ModuleCard, Loading
  hooks/       useMappings (fetches the dataset), StarredContext (starred/saved state)
  lib/         filtering, grouping, and stats helpers over the dataset
data/
  exchange-mappings.xlsx  source workbook (official NUS module-mapping data)
  build_data.py           parses it into public/modules-data.json
public/
  modules-data.json       generated dataset, fetched by the app at runtime
```

## Updating the data

The dataset comes from `data/exchange-mappings.xlsx`. To regenerate `public/modules-data.json`
after updating that file:

```
pip3 install openpyxl
npm run build-data
```

Partner university → country is a hand-maintained lookup in `data/build_data.py` (the source
workbook doesn't include country). If a new partner university shows up in the workbook, the
script will still include its mappings but log a `WARNING: missing country mapping for: [...]`
— add it to the `COUNTRY` dict in that file.
