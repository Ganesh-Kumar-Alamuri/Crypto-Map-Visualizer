"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import countries from "../files/custom.geo.json";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function HtmlMarkersExample() {
   const mountRef = useRef<HTMLDivElement | null>(null);
   const locationsState = useSelector((s: RootState) => s.locations ?? []);
   const linesState = useSelector((s: RootState) => s.lines ?? []);

   useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      let renderer: THREE.WebGLRenderer | undefined;
      let labelRenderer: CSS2DRenderer | undefined;
      let scene: THREE.Scene | undefined;
      let camera: THREE.PerspectiveCamera | undefined;
      let controls: TrackballControls | undefined;
      let globe: any;
      let rafId: number | null = null;

      // tooltip
      const tip = document.createElement("div");
      tip.style.position = "fixed";
      tip.style.pointerEvents = "none";
      tip.style.background = "rgba(10,12,18,0.95)";
      tip.style.color = "#fff";
      tip.style.padding = "8px 10px";
      tip.style.borderRadius = "8px";
      tip.style.boxShadow = "0 6px 18px rgba(0,0,0,0.6)";
      tip.style.display = "none";
      tip.style.zIndex = "9999";
      tip.style.fontSize = "13px";
      tip.style.maxWidth = "260px";
      document.body.appendChild(tip);

      (async () => {
         const ThreeGlobe = (await import("three-globe")).default;

         // renderer + labelRenderer
         renderer = new THREE.WebGLRenderer({ antialias: true });
         renderer.setSize(window.innerWidth, window.innerHeight);
         renderer.setPixelRatio(window.devicePixelRatio);
         container.appendChild(renderer.domElement);

         labelRenderer = new CSS2DRenderer();
         labelRenderer.setSize(window.innerWidth, window.innerHeight);
         labelRenderer.domElement.style.position = "absolute";
         labelRenderer.domElement.style.top = "0";
         labelRenderer.domElement.style.pointerEvents = "none";
         container.appendChild(labelRenderer.domElement);

         // scene + camera
         scene = new THREE.Scene();
         scene.background = new THREE.Color(0x040d21);
         camera = new THREE.PerspectiveCamera();
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
         camera.position.set(0, 0, 400);
         scene.add(camera);

         scene.add(new THREE.AmbientLight(0xbbbbbb, 0.3));
         const dl = new THREE.DirectionalLight(0xffffff, 0.8);
         dl.position.set(-800, 2000, 400);
         camera.add(dl);

         // globe
         globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true })
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.7)
            .showAtmosphere(true)
            .atmosphereColor("#3a228a")
            .atmosphereAltitude(0.25);

         // clone lines/locations to avoid mutation of frozen objects
         const arcsData = (Array.isArray(linesState) ? linesState : []).map(
            (l: any) => ({ ...l })
         );
         globe
            .arcsData(arcsData)
            .arcColor((e: any) => (e.status ? "#9cff00" : "#ff4000"))
            .arcAltitude((e: any) => e.arcAlt)
            .arcStroke((e: any) => (e.status ? 0.5 : 0.3))
            .arcAltitudeAutoScale(1)
            .arcDashLength(0.9)
            .arcDashGap(4)
            .arcDashAnimateTime(1000)
            .arcsTransitionDuration(1000)
            .arcDashInitialGap((e: any) => (e.order ?? 0) * 1);

         globe.rotateY(-Math.PI * (5 / 9));
         globe.rotateZ(-Math.PI / 6);
         const globeMaterial = globe.globeMaterial();
         globeMaterial.setValues({
            color: new THREE.Color(0x3a228a),
            emissive: new THREE.Color(0x220038),
            emissiveIntensity: 0.1,
            shininess: 0.7,
         });

         scene.add(globe);

         const points = (
            Array.isArray(locationsState) ? locationsState : []
         ).map((e: any) => ({ ...e, lat: e.lat, lng: e.lng }));
         const providerColor = (p?: string) => {
            if (!p) return "#888";
            const u = p.toLowerCase();
            if (u.includes("aws")) return "#f54242";
            if (u.includes("gcp")) return "#42f545";
            return "#4242f5";
         };

         globe.htmlElementsData(points).htmlElement((d: any) => {
            const el = document.createElement("div");
            el.className = "globe-point";
            el.style.width = "10px";
            el.style.height = "10px";
            el.style.borderRadius = "50%";
            el.style.background = providerColor(d.provider);
            el.style.boxShadow = "0 0 8px rgba(0,0,0,0.6)";
            el.style.transition = "transform 120ms ease, opacity 120ms";
            el.style.opacity = "0.95";
            el.style.pointerEvents = "auto";

            el.addEventListener("mouseenter", (ev) => {
               tip.style.display = "block";
               tip.innerHTML = `
            <div style="font-weight:600;margin-bottom:6px">${
               d.country || d.text || "Unknown"
            }</div>
            <div style="font-size:12px;color:#cfd8dc">id: ${
               d.text || d.id || "-"
            }</div>
            <div style="font-size:12px;color:#cfd8dc">provider: ${
               d.provider || "-"
            }</div>
            <div style="font-size:12px;color:#cfd8dc">region: ${
               d.region || "-"
            }</div>
            <div style="margin-top:6px;font-size:12px;color:#a0a0a0">lat ${Number(
               d.lat
            ).toFixed(4)}, lng ${Number(d.lng).toFixed(4)}</div>
          `;
               const me = ev as MouseEvent;
               tip.style.left = `${me.clientX + 12}px`;
               tip.style.top = `${me.clientY + 12}px`;
               el.style.transform = "scale(1.5)";
            });
            el.addEventListener("mousemove", (ev) => {
               const me = ev as MouseEvent;
               tip.style.left = `${me.clientX + 12}px`;
               tip.style.top = `${me.clientY + 12}px`;
            });
            el.addEventListener("mouseleave", () => {
               tip.style.display = "none";
               el.style.transform = "scale(1)";
            });
            return el;
         });

         // controls
         controls = new TrackballControls(camera!, renderer!.domElement);
         controls.minDistance = 101;
         controls.rotateSpeed = 3;
         controls.zoomSpeed = 0.8;
         controls.addEventListener("change", () =>
            globe.setPointOfView(camera)
         );

         // animation loop with RAF id for cleanup
         const animate = () => {
            controls!.update();
            renderer!.render(scene!, camera!);
            labelRenderer!.render(scene!, camera!);
            rafId = requestAnimationFrame(animate);
         };
         rafId = requestAnimationFrame(animate);

         // resize
         const onResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (renderer) renderer.setSize(w, h);
            if (labelRenderer) labelRenderer.setSize(w, h);
            if (camera) {
               camera.aspect = w / h;
               camera.updateProjectionMatrix();
            }
         };
         window.addEventListener("resize", onResize);

         
         // cleanup on effect rerun/unmount
         const cleanup = () => {
            window.removeEventListener("resize", onResize);
            if (rafId != null) cancelAnimationFrame(rafId);
            try {
               controls?.dispose();
            } catch {}
            try {
               // remove render DOM nodes
               if (renderer?.domElement?.parentNode === container)
                  container.removeChild(renderer.domElement);
            } catch {}
            try {
               if (labelRenderer?.domElement?.parentNode === container)
                  container.removeChild(labelRenderer.domElement);
            } catch {}
            try {
               renderer?.dispose();
            } catch {}
            try {
               // remove globe from scene
               if (scene && globe) {
                  scene.remove(globe);
               }
            } catch {}
            try {
               if (tip && tip.parentNode) tip.parentNode.removeChild(tip);
            } catch {}
         };

         // attach cleanup to outer scope so the outer finally can call it
         (container as any).__globeCleanup = cleanup;
      })();

      return () => {
         // call cleanup attached earlier (if any)
         try {
            const c = (container as any).__globeCleanup;
            if (typeof c === "function") c();
            delete (container as any).__globeCleanup;
         } catch {}
      };
      
   }, [(locationsState as any[]).length, (linesState as any[]).length]);

   return (
      <div
         ref={mountRef}
         style={{ width: "100vw", height: "100vh", position: "relative" }}
      />
   );
}
