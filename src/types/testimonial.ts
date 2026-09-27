export const TESTIMONIAL_TONES = [
  "cream",
  "amber",
  "teal",
  "sage",
  "blush",
  "ink",
] as const;

export type TestimonialTone = (typeof TESTIMONIAL_TONES)[number];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  product: string;
  tone: TestimonialTone;
  avatarUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type TestimonialInput = {
  quote: string;
  name: string;
  role: string;
  company: string;
  product: string;
  tone: TestimonialTone;
  avatarUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};
