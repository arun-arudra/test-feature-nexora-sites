import type { Metadata } from "next";
import "./cms-shell.css";

export const metadata: Metadata = {
  title: "CMS Admin",
  robots: { index: false, follow: false },
};

export default function CmsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="theme-v2 cms-shell h-dvh max-h-dvh overflow-y-auto bg-black font-sans text-white">{children}</div>;
}
