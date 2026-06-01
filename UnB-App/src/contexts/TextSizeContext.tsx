import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

type TextSize = "normal" | "large" | "larger";

interface TextSizeContextValue {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  getFontSize: (baseSize: number) => number;
}

const SCALE_BY_SIZE: Record<TextSize, number> = {
  normal: 1,
  large: 1.15,
  larger: 1.3,
};

const TextSizeContext = createContext<TextSizeContextValue | null>(null);

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const [textSize, setTextSize] = useState<TextSize>("normal");

  const value = useMemo(
    () => ({
      textSize,
      setTextSize,
      getFontSize: (baseSize: number) => Math.round(baseSize * SCALE_BY_SIZE[textSize]),
    }),
    [textSize]
  );

  return <TextSizeContext.Provider value={value}>{children}</TextSizeContext.Provider>;
}

export function useTextSize() {
  const context = useContext(TextSizeContext);

  if (!context) {
    throw new Error("useTextSize must be used inside TextSizeProvider");
  }

  return context;
}
