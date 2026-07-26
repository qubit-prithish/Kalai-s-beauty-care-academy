"use client";

import Image from "next/image";
import style from "./HeroWoman.module.css";

export function HeroWoman() {
  return (
    <div className={style.womanColumn} aria-hidden="true">
      <div className={style.womanGlow} />
      <div className={style.womanWrapper}>
        <Image
          src="/images/hero-woman.webp"
          alt="Intricate mehendi henna detail — Kalai's Beauty Care Academy"
          className={style.woman}
          width={1200}
          height={1800}
          priority
          draggable="false"
        />
      </div>
    </div>
  );
}