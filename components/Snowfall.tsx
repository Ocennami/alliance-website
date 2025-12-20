"use client";

import { useEffect, useState, useCallback } from "react";

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

interface SnowfallProps {
  /** Number of snowflakes */
  count?: number;
  /** Minimum snowflake size in pixels */
  minSize?: number;
  /** Maximum snowflake size in pixels */
  maxSize?: number;
  /** Minimum fall speed */
  minSpeed?: number;
  /** Maximum fall speed */
  maxSpeed?: number;
  /** Whether snowfall is enabled */
  enabled?: boolean;
}

export default function Snowfall({
  count = 50,
  minSize = 3,
  maxSize = 8,
  minSpeed = 0.5,
  maxSpeed = 2,
  enabled = true,
}: SnowfallProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Initialize window size and snowflakes
  useEffect(() => {
    if (!enabled) return;

    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, [enabled]);

  // Create snowflakes
  const createSnowflake = useCallback(
    (id: number, startFromTop: boolean = false): Snowflake => ({
      id,
      x: Math.random() * windowSize.width,
      y: startFromTop ? -20 : Math.random() * windowSize.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      opacity: Math.random() * 0.6 + 0.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }),
    [windowSize.width, windowSize.height, minSize, maxSize, minSpeed, maxSpeed]
  );

  // Initialize snowflakes when window size is available
  useEffect(() => {
    if (!enabled || windowSize.width === 0) return;

    const initialSnowflakes: Snowflake[] = [];
    for (let i = 0; i < count; i++) {
      initialSnowflakes.push(createSnowflake(i, false));
    }
    setSnowflakes(initialSnowflakes);
  }, [enabled, count, windowSize.width, createSnowflake]);

  // Animation loop
  useEffect(() => {
    if (!enabled || snowflakes.length === 0) return;

    let animationFrameId: number;

    const animate = () => {
      setSnowflakes((prevSnowflakes) =>
        prevSnowflakes.map((flake) => {
          let newY = flake.y + flake.speed;
          let newX = flake.x + Math.sin(flake.wobble) * 0.5;
          const newWobble = flake.wobble + flake.wobbleSpeed;

          // Reset snowflake when it goes off screen
          if (newY > windowSize.height + 20) {
            return createSnowflake(flake.id, true);
          }

          // Wrap around horizontally
          if (newX > windowSize.width + 20) {
            newX = -20;
          } else if (newX < -20) {
            newX = windowSize.width + 20;
          }

          return {
            ...flake,
            x: newX,
            y: newY,
            wobble: newWobble,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [enabled, snowflakes.length, windowSize, createSnowflake]);

  if (!enabled || windowSize.width === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: flake.x,
            top: flake.y,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            boxShadow: `0 0 ${flake.size * 2}px rgba(255, 255, 255, 0.8)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
