"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { applyFilters } from "../store/store";

export default function ControlPanel() {
   const dispatch = useDispatch();
   const current = useSelector((s: RootState) => s.filters);

   const [aws, setAws] = useState<boolean>(current.aws);
   const [azure, setAzure] = useState<boolean>(current.azure);
   const [gcp, setGcp] = useState<boolean>(current.gcp);

   // dispatch initial apply to ensure store is synced (and lines/locations computed)
   useEffect(() => {
      dispatch(applyFilters({ aws, azure, gcp }));
      
   }, []);

   // whenever any checkbox changes, dispatch a single action with all options
   useEffect(() => {
      dispatch(applyFilters({ aws, azure, gcp }));
   }, [aws, azure, gcp, dispatch]);

   const container: React.CSSProperties = {
      display: "flex",
      gap: 12,
      alignItems: "center",
      flexWrap: "wrap",
      maxWidth: 520,
      padding: "6px 8px",
      boxSizing: "border-box",
      overflow: "hidden",
   };

   const group: React.CSSProperties = {
      display: "flex",
      gap: 12,
      alignItems: "center",
      background: "rgba(255,255,255,0.03)",
      padding: "6px 8px",
      borderRadius: 8,
      whiteSpace: "nowrap",
   };

   const labelStyle: React.CSSProperties = {
      display: "flex",
      gap: 8,
      alignItems: "center",
      cursor: "pointer",
      fontSize: 13,
      color: "#e6eef8",
   };

   const dot = (color: string): React.CSSProperties => ({
      width: 12,
      height: 12,
      borderRadius: 6,
      background: color,
      boxShadow: "0 0 6px rgba(0,0,0,0.45)",
   });

   return (
      <div style={container}>
         <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            Filters
         </div>

         <div style={group}>
            <label style={labelStyle}>
               <input
                  aria-label="AWS"
                  type="checkbox"
                  checked={aws}
                  onChange={(e) => setAws(e.target.checked)}
                  style={{ width: 14, height: 14 }}
               />
               <span style={dot("#f54242")} />
               <span style={{ color: "#cfe8d8" }}>AWS</span>
            </label>

            <label style={labelStyle}>
               <input
                  aria-label="Azure"
                  type="checkbox"
                  checked={azure}
                  onChange={(e) => setAzure(e.target.checked)}
                  style={{ width: 14, height: 14 }}
               />
               <span style={dot("#4242f5")} />
               <span style={{ color: "#cfe8d8" }}>Azure</span>
            </label>

            <label style={labelStyle}>
               <input
                  aria-label="GCP"
                  type="checkbox"
                  checked={gcp}
                  onChange={(e) => setGcp(e.target.checked)}
                  style={{ width: 14, height: 14 }}
               />
               <span style={dot("#42f545")} />
               <span style={{ color: "#cfe8d8" }}>GCP</span>
            </label>
         </div>
      </div>
   );
}
