"use client";
import React from "react";
import Globe from "./components/Globe";
import ControlPanel from "./components/control-panel";

export default function Page() {
   const HEADER_HEIGHT = 64;

   return (
      <main
         style={{
            height: "100vh",
            width: "100vw",
            margin: 0,
            padding: 0,
            overflow: "hidden", // prevent body scrollbars from main content
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
         }}
      >
         <div
            style={{
               height: HEADER_HEIGHT,
               flex: `0 0 ${HEADER_HEIGHT}px`, // fixed header — prevents layout shift
               padding: "10px 16px",
               background: "#0b1220",
               color: "#fff",
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               gap: 12,
               boxSizing: "border-box",
            }}
         >
            <h2
               style={{
                  margin: 0,
                  fontSize: 18,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
               }}
            >
               Crypto Exchange Latency Visualizer
            </h2>

            <ControlPanel />
         </div>

         <div
            style={{
               flex: "1 1 auto",
               minHeight: 0, // IMPORTANT for child flex to allow proper overflow handling
               overflow: "hidden", // prevent inner scrollbar; globe should handle resizing
            }}
         >
            <Globe />
         </div>
      </main>
   );
}
