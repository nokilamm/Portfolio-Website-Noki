"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollingGridShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationId: number;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      #define FC gl_FragCoord.xy
      #define R resolution
      #define T time
      #define MN min(R.x,R.y)

      void main(void) {
          vec2 uv = (FC - 0.5 * R) / MN;
          uv.x += T * 0.1;

          vec3 col = vec3(0.0);
          float s = 12.0, e = 9e-4;
          col += e / (sin(uv.x * s) * cos(uv.y * s));

          gl_FragColor = vec4(col, 1.0);
      }
    `;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    let frameCount = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      frameCount++;
      if (frameCount % 2 !== 0) return; // ~30fps cap
      uniforms.time.value += 0.016;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    />
  );
}
