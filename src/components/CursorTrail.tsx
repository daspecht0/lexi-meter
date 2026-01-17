"use client";

import { useEffect, useCallback } from "react";

const EMOJIS = ["🦄", "✨", "💖", "⭐", "🌈", "💫", "🎀", "💜", "🌟", "🦋"];
const COLORS = ["#FF1493", "#FFE135", "#9B59B6", "#32CD32", "#FF6B35", "#00FFFF", "#FF69B4"];

export default function CursorTrail() {
  const createSparkle = useCallback((x: number, y: number) => {
    const sparkle = document.createElement("div");
    const isEmoji = Math.random() > 0.3;

    if (isEmoji) {
      sparkle.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      sparkle.style.fontSize = `${Math.random() * 20 + 12}px`;
    } else {
      sparkle.textContent = "✦";
      sparkle.style.fontSize = `${Math.random() * 16 + 8}px`;
      sparkle.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    sparkle.style.position = "fixed";
    sparkle.style.left = `${x - 10 + Math.random() * 20}px`;
    sparkle.style.top = `${y - 10 + Math.random() * 20}px`;
    sparkle.style.pointerEvents = "none";
    sparkle.style.userSelect = "none";
    sparkle.style.zIndex = "9999";
    sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;
    sparkle.style.opacity = "1";

    document.body.appendChild(sparkle);

    // Force a reflow to ensure initial styles are applied before transition
    sparkle.offsetHeight;

    sparkle.style.transition = "all 2s ease-out";
    sparkle.style.opacity = "0";
    sparkle.style.transform = `rotate(${Math.random() * 360}deg) translateY(${-50 - Math.random() * 80}px) scale(0.3)`;

    setTimeout(() => {
      sparkle.remove();
    }, 2000);
  }, []);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let throttle = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - throttle < 30) return;
      throttle = now;

      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );

      if (distance > 10) {
        createSparkle(e.clientX, e.clientY);
        if (Math.random() > 0.5) {
          createSparkle(e.clientX, e.clientY);
        }
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [createSparkle]);

  return null;
}
