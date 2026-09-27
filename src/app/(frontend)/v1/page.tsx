import { notFound } from "next/navigation";

/** Legacy path — intentionally unavailable (no redirect to homepage). */
export default function LegacyV1Path() {
  notFound();
}
