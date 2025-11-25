import {
   configureStore,
   createAction,
   createSlice,
   PayloadAction,
} from "@reduxjs/toolkit";
import originalMap from "../files/map.json";
import originalLines from "../files/lines.json";

type Location = {
   text: string;
   country?: string;
   lat?: number;
   lng?: number;
   provider?: string;
   region?: string;
   size?: number;
};

type Line = {
   id: string;
   from: string;
   to: string;
   startLat?: number;
   startLng?: number;
   endLat?: number;
   endLng?: number;
   arcAlt?: number;
   status?: boolean;
   order?: number;
};

type Filters = { aws: boolean; azure: boolean; gcp: boolean };

const ORIGINAL_LOCATIONS: Location[] = ((originalMap as any).coords ??
   []) as Location[];
const ORIGINAL_LINES: Line[] = ((originalLines as any).lines ?? []) as Line[];

const defaultFilters: Filters = { aws: true, azure: true, gcp: true };

// single action used to set all filter options at once
export const applyFilters = createAction<Filters>("app/applyFilters");

// locations slice (will respond to applyFilters)
const locationsSlice = createSlice({
   name: "locations",
   initialState: ORIGINAL_LOCATIONS as Location[],
   reducers: {
      setLocations() {
         /* not used - kept for completeness */
      },
   },
   extraReducers: (builder) => {
      builder.addCase(applyFilters, (_, action: PayloadAction<Filters>) => {
         const f = action.payload;
         const visible = ORIGINAL_LOCATIONS.filter((c) => {
            const p = (c.provider || "").toString().toLowerCase();
            if (p.includes("aws")) return f.aws;
            if (p.includes("gcp")) return f.gcp;
            if (p.includes("azure")) return f.azure;
            return false;
         });
         return visible;
      });
   },
});

// lines slice (will respond to applyFilters)
const linesSlice = createSlice({
   name: "lines",
   initialState: ORIGINAL_LINES as Line[],
   reducers: {
      setLines() {
         /* not used - kept for completeness */
      },
   },
   extraReducers: (builder) => {
      builder.addCase(applyFilters, (_, action: PayloadAction<Filters>) => {
         const f = action.payload;
         // recompute visible location ids according to filters
         const visible = ORIGINAL_LOCATIONS.filter((c) => {
            const p = (c.provider || "").toString().toLowerCase();
            if (p.includes("aws")) return f.aws;
            if (p.includes("gcp")) return f.gcp;
            if (p.includes("azure")) return f.azure;
            return false;
         });
         const visibleIds = new Set(visible.map((v) => v.text));
         const visibleLines = ORIGINAL_LINES.filter(
            (ln) => visibleIds.has(ln.from) && visibleIds.has(ln.to)
         );
         return visibleLines;
      });
   },
});

// filters slice (will respond to applyFilters)
const filtersSlice = createSlice({
   name: "filters",
   initialState: defaultFilters as Filters,
   reducers: {
      setFilters() {
         /* not used directly */
      },
   },
   extraReducers: (builder) => {
      builder.addCase(applyFilters, (_, action: PayloadAction<Filters>) => {
         return action.payload;
      });
   },
});

export const store = configureStore({
   reducer: {
      locations: locationsSlice.reducer,
      lines: linesSlice.reducer,
      filters: filtersSlice.reducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
