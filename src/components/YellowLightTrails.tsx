/**
 * Murky amber haze + scratchy degraded linework, tiled into a seamless
 * vertical scroll.
 *
 * Performance shape matters here: the smudge filter is expensive, so it only
 * ever wraps *static* geometry. Nothing inside a filtered group animates,
 * which lets the browser rasterise each filter once and then just composite
 * it. Motion comes from a transform on the track and from the unfiltered
 * rings, both of which are cheap.
 */
function KrulePanel({ seed }: { seed: number }) {
  const smudgeId = `krule-smudge-${seed}`;

  return (
    <div className="krule-panel">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <filter
            id={smudgeId}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.024"
              numOctaves="2"
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Static, so the filter result stays cached */}
        <g className="krule-ink" filter={`url(#${smudgeId})`}>
          <path
            className="krule-line krule-line-a"
            d="M-60 560 C 220 520, 360 600, 620 545 S 1020 470, 1300 540 S 1520 580, 1660 520"
          />
          <path
            className="krule-line krule-line-b"
            d="M-40 640 C 260 610, 420 680, 700 630 S 1120 560, 1380 625 S 1560 660, 1660 610"
          />
          <path
            className="krule-line krule-line-c"
            d="M120 880 C 200 720, 150 640, 240 560 S 300 420, 250 300"
          />
          <path
            className="krule-line krule-line-d"
            d="M1420 880 C 1360 720, 1420 620, 1350 520 S 1300 380, 1360 260"
          />
          <path
            className="krule-line krule-line-e"
            d="M480 200 C 620 260, 780 180, 940 240"
          />
          <path
            className="krule-line krule-line-f"
            d="M-80 760 C 180 700, 390 790, 650 735 S 1050 655, 1320 730 S 1510 770, 1680 700"
          />
          <path
            className="krule-line krule-line-g"
            d="M80 390 C 310 350, 500 425, 760 375 S 1110 300, 1510 370"
          />
        </g>

        {/* Unfiltered so animating them never dirties the filtered layer */}
        <g className="krule-rings">
          <g className="krule-ring-set krule-ring-set--a">
            <ellipse cx="300" cy="270" rx="110" ry="74" />
            <ellipse cx="300" cy="270" rx="215" ry="142" />
            <ellipse cx="300" cy="270" rx="330" ry="216" />
          </g>
          <g className="krule-ring-set krule-ring-set--b">
            <ellipse cx="1240" cy="660" rx="125" ry="80" />
            <ellipse cx="1240" cy="660" rx="250" ry="160" />
            <ellipse cx="1240" cy="660" rx="395" ry="248" />
          </g>
          <g className="krule-ring-set krule-ring-set--c">
            <ellipse cx="880" cy="130" rx="150" ry="94" />
            <ellipse cx="880" cy="130" rx="285" ry="178" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function YellowLightTrails() {
  return (
    <div className="yellow-trails" aria-hidden>
      <div className="krule-track">
        <KrulePanel seed={7} />
        <KrulePanel seed={7} />
      </div>
    </div>
  );
}
