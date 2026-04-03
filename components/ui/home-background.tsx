"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { ScrollingGridShader } from "@/components/ui/grid-shader";

export function HomeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#141414",
      }}
    >
      {/* Grid layer — sits beneath the aurora, adds structure */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
        <ScrollingGridShader />
      </div>

      {/* Aurora layer — glows on top of the grid */}
      <AuroraBackground
        className="absolute inset-0 h-full w-full bg-transparent"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
