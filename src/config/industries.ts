export type Industry = {
  slug: string;
  title: string;
  href: string;
  short: string;
  problems: string[];
  features: string[];
  outcome: string;
};

export const industries: Industry[] = [
  {
    slug: "restaurants",
    title: "Restaurants & Cafes",
    href: "/industries/restaurants",
    short: "Menus, photos, and WhatsApp enquiries that turn searches into walk-ins and orders.",
    problems: [
      "Customers only find you on Instagram or Swiggy/Zomato",
      "Old website looks unprofessional on mobile",
      "No easy way to message or reserve",
    ],
    features: ["Digital menu", "Gallery", "WhatsApp enquiry/order", "Maps & timings", "Local SEO basics"],
    outcome: "More direct enquiries and less dependence on aggregators.",
  },
  {
    slug: "hotels-resorts",
    title: "Hotels & Resorts",
    href: "/industries/hotels-resorts",
    short: "Room showcases and direct booking enquiries so you keep more revenue.",
    problems: [
      "OTA commissions eat into profits",
      "Guests can’t book or enquire easily on WhatsApp",
      "Website doesn’t show the property well",
    ],
    features: ["Room pages", "Gallery", "Direct enquiry/booking intent", "WhatsApp CTA", "SEO for local stays"],
    outcome: "More direct guest enquiries and stronger brand trust.",
  },
  {
    slug: "hospitals-clinics",
    title: "Hospitals & Clinics",
    href: "/industries/hospitals-clinics",
    short: "Clean, trustworthy sites for departments, doctors, and appointment enquiries.",
    problems: [
      "Patients can’t find clear treatment information",
      "Appointment enquiry is only by phone",
      "Website feels outdated or unreliable",
    ],
    features: ["Departments/doctors", "Appointment enquiry", "Maps & contact", "Trust-focused UI", "Mobile-first"],
    outcome: "More patient enquiries and a more credible online presence.",
  },
  {
    slug: "cloud-kitchens",
    title: "Cloud Kitchens",
    href: "/industries/cloud-kitchens",
    short: "Brand credibility, menus, and enquiry flows beyond delivery apps.",
    problems: [
      "Brand exists only on delivery platforms",
      "No owned website for corporate or bulk orders",
      "Hard to stand out with a real brand story",
    ],
    features: ["Menu showcase", "Bulk/corporate enquiry", "WhatsApp ordering intent", "Brand pages", "Mobile UX"],
    outcome: "Own your brand and capture direct enquiries.",
  },
  {
    slug: "shops-ecommerce",
    title: "Shops & Ecommerce",
    href: "/industries/shops-ecommerce",
    short: "Catalog sites and stores with UPI/Razorpay and COD-ready flows.",
    problems: [
      "No online catalog for customers",
      "Payments and COD are confusing",
      "Instagram alone is not enough to sell",
    ],
    features: ["Product catalog", "Razorpay/UPI", "COD options", "WhatsApp support", "Mobile checkout basics"],
    outcome: "Start selling online with a store you own.",
  },
  {
    slug: "villas-homestays",
    title: "Villas & Homestays",
    href: "/industries/villas-homestays",
    short: "Photo-led websites with WhatsApp booking enquiries for stays and rentals.",
    problems: [
      "Guests only find you on OTAs",
      "Photos and amenities are scattered",
      "No simple enquiry path",
    ],
    features: ["Photo galleries", "Amenities", "Availability enquiry", "WhatsApp booking", "Local SEO"],
    outcome: "More direct stay enquiries from Google and WhatsApp.",
  },
  {
    slug: "education",
    title: "Education",
    href: "/industries/education",
    short: "School and institute websites that build trust and capture admission enquiries.",
    problems: [
      "Parents can’t find clear course or fee information",
      "Admission enquiry is only by phone",
      "Website looks outdated vs competing institutes",
    ],
    features: ["Courses & programs", "Admission enquiry", "Gallery", "Faculty/about", "Mobile-first"],
    outcome: "More qualified admission and course enquiries.",
  },
  {
    slug: "real-estate",
    title: "Real estate",
    href: "/industries/real-estate",
    short: "Project and property pages that turn browsers into site-visit enquiries.",
    problems: [
      "Projects are hard to showcase clearly",
      "Leads get lost in WhatsApp chats",
      "No strong local SEO presence",
    ],
    features: ["Project pages", "Gallery", "Lead forms", "Maps", "WhatsApp CTA"],
    outcome: "More site-visit and sales enquiries.",
  },
  {
    slug: "beauty",
    title: "Beauty",
    href: "/industries/beauty",
    short: "Salon and clinic sites with services, gallery, and easy booking enquiries.",
    problems: [
      "Instagram alone doesn’t convert walk-ins reliably",
      "Services and pricing are unclear",
      "No simple booking enquiry path",
    ],
    features: ["Services menu", "Before/after gallery", "Booking enquiry", "WhatsApp", "Local SEO"],
    outcome: "More appointment enquiries and walk-ins.",
  },
  {
    slug: "finance",
    title: "Finance",
    href: "/industries/finance",
    short: "Clean, trustworthy sites for advisors, CA firms, and finance services.",
    problems: [
      "Hard to look credible online",
      "Services are not clearly explained",
      "Lead forms are missing or weak",
    ],
    features: ["Services pages", "Trust content", "Lead forms", "WhatsApp", "SEO basics"],
    outcome: "More consultation enquiries from serious clients.",
  },
];
