/**
 * Nexora V2 design tokens (Premier-inspired — original UI, shared feel).
 * Source extraction: 2026-09-19. Edit hex values here conceptually via v2.css `.theme-v2`.
 */
export const v2Tokens = {
  primary: "#4600BB",
  accent: "#6B33C9",
  surface: "#000000",
  elevated: "#171717",
  light: "#E4E7F2",
  text: "#FFFFFF",
  lightText: "#0A0A0A",
  muted: "#949494",
  lightMuted: "#5C5C66",
  border: "#3E3E3E",
  neonFrom: "#5400E9",
  neonTo: "#936AA7",
  radiusButton: 10,
  radiusCard: 12,
  spacing: [4, 8, 12, 16, 20, 24, 28, 32, 48, 64] as const,
  font: "Outfit",
  /** Homepage section tone map — Work sandwiched by light Process + Pricing */
  rhythm: [
    "dark", // hero
    "accent", // stats
    "light", // full stack
    "dark", // pitch (black)
    "elevated", // services (grey)
    "dark", // industries
    "light", // process
    "dark", // work (proof)
    "dark", // pricing
    "light", // amc
    "dark", // reviews
    "dark", // news
    "dark", // faq
    "dark", // final cta
  ] as const,
} as const;
