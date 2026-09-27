"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/config/site";

export function StickyWhatsApp() {
  return (
    <a
      href={getWhatsAppLink(
        "Hi, I want a website for my business in Karnataka/Andhra. Please guide me.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:scale-[1.03] hover:brightness-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
