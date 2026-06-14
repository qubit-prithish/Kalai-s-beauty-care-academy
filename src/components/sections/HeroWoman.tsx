"use client";

import style from "./HeroWoman.module.css";

export function HeroWoman() {
  return (
    <>
      <div className={style.womanGlow} aria-hidden="true" />
      <div className={style.womanWrapper} aria-hidden="true">
        <img
          src="/images/hero-woman.webp"
          alt="Bridal beauty services at Kalai's Beauty Care Academy"
          className={style.woman}
          width={1200}
          height={1800}
          loading="eager"
          fetchPriority="high"
          draggable="false"
        />
      </div>
    </>
  );
}