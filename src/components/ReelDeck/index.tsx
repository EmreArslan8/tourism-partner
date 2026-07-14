"use client";

import { Children } from "react";
import { TRANSITION_EASE, TRANSITION_MS, useReelDeck } from "./useReelDeck";
import styles from "./styles";

/*
 * ReelDeck — Instagram Reels mantığında tam-sayfa geçiş.
 * Her doğrudan child = bir 100dvh panel. Bir hamle (wheel / swipe / klavye) = bir panel;
 * yarım kaydırma yok, geçiş yumuşak animasyonla. Etkileşim mantığı useReelDeck'te,
 * momentum tespiti momentum.ts'te; bu bileşen yalnızca paneller + transform sunumu.
 */
const ReelDeck = ({ children }: { children: React.ReactNode }) => {
  const panels = Children.toArray(children);
  const { index, reduced, rootRef } = useReelDeck(panels.length);

  return (
    <div ref={rootRef} className={styles.root}>
      <div
        className={styles.track}
        style={{
          transform: `translate3d(0, ${-index * 100}dvh, 0)`,
          transition: reduced ? "none" : `transform ${TRANSITION_MS}ms ${TRANSITION_EASE}`,
        }}
      >
        {panels.map((panel, i) => (
          <div key={i} className={styles.panel}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelDeck;
