"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Confetti() {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const schedule = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 1));
    const cancel = window.cancelIdleCallback ?? clearTimeout;

    const handle = schedule(
      () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      },
      { timeout: 1000 },
    );

    return () => cancel(handle);
  }, []);

  if (!dimensions) {
    return null;
  }

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={dimensions.width < 768 ? 150 : 400}
      onConfettiComplete={() => setDimensions(null)}
    />
  );
}
