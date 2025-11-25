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
