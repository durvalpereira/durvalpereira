import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

const RED = "#DD1C24";
const WHITE = "#FFFFFF";
const INK = "#111111";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Stripes: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = 6;
  return (
    <AbsoluteFill style={{ backgroundColor: WHITE }}>
      {Array.from({ length: bars }).map((_, i) => {
        const x = interpolate(frame, [i * 1.5, i * 1.5 + 10], [-110, 110], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(i * 100) / bars}%`,
              height: `${100 / bars + 0.5}%`,
              width: "100%",
              backgroundColor: RED,
              transform: `translateX(${i % 2 ? -x : x}%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const WordCut: React.FC<{ word: string; inverted: boolean }> = ({ word, inverted }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 10], [1.25, 1], {
    ...clamp,
    easing: Easing.out(Easing.exp),
  });
  const spacing = interpolate(frame, [0, 10], [0.12, 0.01], clamp);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: inverted ? WHITE : RED,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 300,
          color: inverted ? RED : WHITE,
          letterSpacing: `${spacing}em`,
          transform: `scale(${scale})`,
          lineHeight: 1,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

const GhostRows: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: interpolate(frame, [10, 30], [0, 1], clamp) }}>
      {rows.map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: r * 230 - 40,
            whiteSpace: "nowrap",
            fontFamily,
            fontSize: 220,
            color: "transparent",
            WebkitTextStroke: "2px #EEEEEE",
            transform: `translateX(${(r % 2 ? -1 : 1) * frame * 3 - 600}px)`,
          }}
        >
          {"NEXT LEVEL · ".repeat(8)}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nextIn = spring({ frame, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });
  const levelIn = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });

  const hit = 11;
  const punch = interpolate(frame, [hit, hit + 3, hit + 12], [1, 1.07, 1], clamp);
  const shake = frame >= hit && frame < hit + 8 ? Math.sin(frame * 9) * (hit + 8 - frame) * 2 : 0;

  const lineW = interpolate(frame, [22, 38], [0, 760], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tag = interpolate(frame, [30, 44], [0, 1], clamp);

  const type: React.CSSProperties = {
    fontFamily,
    color: RED,
    lineHeight: 0.86,
    letterSpacing: "-0.005em",
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE }}>
      <GhostRows />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translate(${shake}px, ${shake * 0.6}px) scale(${punch})`,
        }}
      >
        <div style={{ overflow: "hidden", paddingTop: 10 }}>
          <div style={{ ...type, fontSize: 330, transform: `translateY(${(1 - nextIn) * -110}%)` }}>
            NEXT
          </div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ ...type, fontSize: 330, transform: `translateY(${(1 - levelIn) * 110}%)` }}>
            LEVEL
          </div>
        </div>
        <div style={{ height: 8, width: lineW, backgroundColor: RED, marginTop: 34 }} />
        <div
          style={{
            fontFamily,
            fontSize: 40,
            color: INK,
            letterSpacing: "0.32em",
            marginTop: 26,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 20}px)`,
          }}
        >
          CONVERSAS · NEGÓCIOS · PESSOAS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WipeOut: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 12], [100, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const black = interpolate(frame, [10, 20], [100, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: RED, transform: `translateY(${y}%)` }} />
      <AbsoluteFill style={{ backgroundColor: INK, transform: `translateY(${black}%)` }} />
    </AbsoluteFill>
  );
};

const WORDS = ["CONVERSAS", "NEGÓCIOS", "PESSOAS", "HISTÓRIAS"];

export const Intro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: WHITE }}>
    <Sequence durationInFrames={20}>
      <Stripes />
    </Sequence>
    {WORDS.map((w, i) => (
      <Sequence key={w} from={14 + i * 10} durationInFrames={10}>
        <WordCut word={w} inverted={i % 2 === 1} />
      </Sequence>
    ))}
    <Sequence from={54}>
      <Logo />
    </Sequence>
    <Sequence from={158}>
      <WipeOut />
    </Sequence>
  </AbsoluteFill>
);
