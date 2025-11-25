# Crypto Map Visualizer

Lightweight Next.js app that visualizes cloud provider servers and network lines on an interactive 3D globe. Filters (AWS / Azure / GCP) drive a Redux store which controls which locations and arcs are visible.

---

## Quick start

1. Install
   ```bash
   npm install
   ```

2. Run dev server
   ```bash
   npm run dev
   ```

3. Build / start
   ```bash
   npm run build
   npm run start
   ```

---

## What it does (short)

- Loads server locations (`app/files/map.json`) and network lines (`app/files/lines.json`).
- Control panel toggles provider filters (AWS / Azure / GCP).
- A single Redux action (`applyFilters`) recomputes visible `locations` and `lines` from the originals.
- Globe component reads Redux state and renders markers and arcs with `three-globe` (or `react-globe.gl` variant).

---

## Project structure (important bits)

- `app/layout.tsx` — app layout + Redux provider wrapper.
- `app/page.tsx` — main page (header + control panel + globe).
- `app/components/control-panel.tsx` — UI to toggle providers (dispatches `applyFilters`).
- `app/components/globe.tsx` — globe renderer (imperative Three.js + three-globe or declarative react-globe.gl).
- `app/store/store.ts` — central Redux store and `applyFilters` logic.
- `app/files/` — `map.json`, `lines.json`, `custom.geo.json` (data sources).
- `public/` — images used by the globe (earth textures).

---

## Key implementation notes

- Single source-of-truth: original JSON files are treated read-only. Store uses originals to recompute visible sets.
- three-globe mutates arc/point objects (it attaches internal properties). Always clone arrays before passing to three-globe:
  ```js
  const arcs = lines.map(l => ({ ...l }));
  ```
- Avoid tearing down the renderer on every update. Initialize ThreeGlobe once and call `globe.arcsData(...)` and `globe.htmlElementsData(...)` to update in-place — this prevents flicker.
- ControlPanel debounces dispatches (150ms recommended) to avoid rapid re-renders on quick toggles.
- If using the `react-globe.gl` wrapper, the component is declarative and lifecycle is handled for you — still clone inputs before passing.

---

## Data format (examples)

- map.json (coords array)
  ```json
  {
    "text": "us-east-1",
    "country": "USA",
    "lat": 37.7749,
    "lng": -122.4194,
    "provider": "AWS",
    "region": "us-east-1",
    "size": 1
  }
  ```

- lines.json (lines array)
  ```json
  {
    "id": "l1",
    "from": "us-east-1",
    "to": "eu-west-1",
    "startLat": 37.7749,
    "startLng": -122.4194,
    "endLat": 53.3498,
    "endLng": -6.2603,
    "arcAlt": 0.4,
    "status": true,
    "order": 1
  }
  ```

---

## Troubleshooting

- "Cannot add property __threeObjArc, object is not extensible": clone objects before passing to three-globe.
- Canvas flicker on filter change: ensure globe is initialized once and updated in-place, or use `react-globe.gl`.
- React useEffect dependency warnings: selectors should always return stable types (return `[]` if no data). Use primitive deps (e.g., `.length`) if needed.

---

## Developer notes / next steps

- Add unit tests for `applyFilters` (verify filtered locations & lines).
- Consider switching markers to WebGL instancing for large datasets.
- Add a small "loading" UI while globe assets load.
- Add a toggle to show lines when at least one endpoint is visible (current logic requires both endpoints).

---

## Contact / contribution

- Tweak `app/store/store.ts` to change filtering logic.
- If you want, I can add unit tests, switch to `react-globe.gl`, or add caching for large datasets.

---
```// filepath: c:\Users\galamuri\Documents\AGK\Learnings\Projects\crypto-map-visualizer\README.md

# Crypto Map Visualizer

Lightweight Next.js app that visualizes cloud provider servers and network lines on an interactive 3D globe. Filters (AWS / Azure / GCP) drive a Redux store which controls which locations and arcs are visible.

---

## Quick start

1. Install
   ```bash
   npm install
   ```

2. Run dev server
   ```bash
   npm run dev
   ```

3. Build / start
   ```bash
   npm run build
   npm run start
   ```

---

## What it does (short)

- Loads server locations (`app/files/map.json`) and network lines (`app/files/lines.json`).
- Control panel toggles provider filters (AWS / Azure / GCP).
- A single Redux action (`applyFilters`) recomputes visible `locations` and `lines` from the originals.
- Globe component reads Redux state and renders markers and arcs with `three-globe` (or `react-globe.gl` variant).

---

## Project structure (important bits)

- `app/layout.tsx` — app layout + Redux provider wrapper.
- `app/page.tsx` — main page (header + control panel + globe).
- `app/components/control-panel.tsx` — UI to toggle providers (dispatches `applyFilters`).
- `app/components/globe.tsx` — globe renderer (imperative Three.js + three-globe or declarative react-globe.gl).
- `app/store/store.ts` — central Redux store and `applyFilters` logic.
- `app/files/` — `map.json`, `lines.json`, `custom.geo.json` (data sources).
- `public/` — images used by the globe (earth textures).

---

## Data format (examples)

- map.json (coords array)
  ```json
  {
    "text": "us-east-1",
    "country": "USA",
    "lat": 37.7749,
    "lng": -122.4194,
    "provider": "AWS",
    "region": "us-east-1",
    "size": 1
  }
  ```

- lines.json (lines array)
  ```json
  {
    "id": "l1",
    "from": "us-east-1",
    "to": "eu-west-1",
    "startLat": 37.7749,
    "startLng": -122.4194,
    "endLat": 53.3498,
    "endLng": -6.2603,
    "arcAlt": 0.4,
    "status": true,
    "order": 1
  }
  ```

---