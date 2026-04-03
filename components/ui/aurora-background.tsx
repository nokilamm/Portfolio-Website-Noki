"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-zinc-900",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--dark-gradient:repeating-linear-gradient(100deg,#00000080_0%,#00000080_7%,transparent_10%,transparent_12%,#00000080_16%)]
            [--aurora:repeating-linear-gradient(100deg,#666666_10%,#aaaaaa_15%,#888888_20%,#cccccc_25%,#777777_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            after:content-[""] after:absolute after:inset-0
            after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:mix-blend-difference
            pointer-events-none absolute -inset-[10px] opacity-30 blur-[10px]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        />
      </div>
      {children}
    </div>
  );
};
