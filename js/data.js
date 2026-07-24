/* ============================================================
   BULUNGI TOWN — SITE CONFIG
   Everything an editor should ever need to change lives here.
   All prices are DEMO PLACEHOLDERS in UGX until confirmed.
   ============================================================ */

const SITE = {
  brandName: "Bulungi Town",

  // PLACEHOLDER — replace with the real WhatsApp number (countrycode + number, no "+")
  whatsappNumber: "256700000000",
  whatsappGreeting: "Hi Bulungi Town! I'd like to book / ask about:",

  tagline: "Café • Arcade • Soft Play",   // the logo lockup
  heroBadge: "Now open at Lugogo Mall", // switch to "Opening soon…" if launch hasn't happened

  location: {
    mall: "Lugogo Mall",
    area: "Lugogo Bypass, Jinja Road, Kampala",
    mapsUrl: "https://maps.google.com/?q=Lugogo+Mall+Kampala",
    // Mall front desk (until Bulungi Town has its own line): +256 781 999 222
  },

  hours: [
    { days: "Mon – Thu", time: "10:00 AM – 9:00 PM" },
    { days: "Fri – Sat", time: "10:00 AM – 10:00 PM" },
    { days: "Sun & Holidays", time: "10:00 AM – 9:00 PM" },
  ],

  socials: {
    tiktok: "https://www.tiktok.com/@bulungitown",     // PLACEHOLDER — confirm handle
    instagram: "https://www.instagram.com/bulungitown", // PLACEHOLDER — confirm handle
    facebook: "https://www.facebook.com/bulungitown",   // PLACEHOLDER — confirm handle
  },

  // Game-card top-up tiers (DEMO VALUES)
  pricing: [
    {
      name: "Starter Card",
      price: "UGX 25,000",
      credits: "30 credits",
      perks: ["Perfect first visit", "Any arcade machine"],
      featured: false,
    },
    {
      name: "Fun Pack",
      price: "UGX 50,000",
      credits: "70 credits",
      perks: ["+15% bonus credits", "Any arcade machine", "Soft play add-on"],
      featured: true,
      badge: "Most Popular",
    },
    {
      name: "Family Mega",
      price: "UGX 100,000",
      credits: "160 credits",
      perks: ["+30% bonus credits", "Up to 4 cards", "Free slushie each"],
      featured: false,
    },
  ],

  parties: [
    {
      name: "Birthday Blast",
      blurb: "Private party corner, game credits for every guest, decorations & a dedicated host.",
      from: "from UGX 350,000", // PLACEHOLDER
    },
    {
      name: "School Day Out",
      blurb: "Weekday group packages for schools — games, soft play & meals at group rates.",
      from: "custom quote",
    },
    {
      name: "Corporate & Teams",
      blurb: "After-hours arcade takeovers and team tournaments on our big machines.",
      from: "custom quote",
    },
  ],

  attractions: [
    {
      icon: "joystick",
      name: "Arcade Games",
      blurb: "Racing rigs, basketball hoops, claw machines, air hockey and the latest video arcade hits.",
    },
    {
      icon: "slide",
      name: "Soft Play Land",
      blurb: "A safe, padded adventure world of slides, ball pits and climbing for the little ones.",
    },
    {
      icon: "coffee",
      name: "The Café",
      blurb: "Great coffee for the grown-ups, slushies and sweet treats for the champions in training.",
    },
    {
      icon: "cake",
      name: "Parties & Events",
      blurb: "Birthdays, school trips and team days — we handle the fun, the food and the cleanup.",
    },
  ],

  // Day-based deals (DEMO PLACEHOLDERS — swap for real weekly promos)
  deals: [
    { day: "TUE", name: "Double-Up Tuesday", blurb: "Every card top-up gets 2x bonus credits, all day." },
    { day: "FRI", name: "Family Friday", blurb: "Free slushie with every Fun Pack after 5 PM." },
    { day: "SUN", name: "Sunday Funday", blurb: "Half-price soft play entry before noon." },
  ],

  // Testimonials (DEMO PLACEHOLDERS — replace with real reviews)
  testimonials: [
    { quote: "My kids never want to leave. The soft play area is spotless and the staff are wonderful.", name: "Sarah K.", tag: "Mum of two" },
    { quote: "Best birthday party we've ever thrown — they handled everything, we just showed up.", name: "Brian & Doreen", tag: "Birthday party" },
    { quote: "The racing games are unmatched anywhere in Kampala. I'm here every weekend.", name: "Timothy O.", tag: "Regular" },
  ],

  // Ticker tape items (top marquee)
  ticker: [
    "NEW GAMES JUST LANDED",
    "BIRTHDAY PARTIES",
    "SOFT PLAY FOR LITTLE ONES",
    "WIN TICKETS · CLAIM PRIZES",
    "BOOK ON WHATSAPP",
  ],

  // The playable games in the on-site arcade cabinet
  games: [
    {
      id: "blast",
      name: "Bulungi Blast",
      icon: "playerM",
      tag: "Catch coins & gifts, dodge the bombs. Pick your player!",
      rewardThreshold: 500,
    },
    {
      id: "bowl",
      name: "Pixel Bowling",
      icon: "bowling",
      tag: "Line it up, let it rip — 5 racks to prove yourself.",
      rewardThreshold: 400,
    },
    {
      id: "golf",
      name: "Mini Golf",
      icon: "golf",
      tag: "3 holes, tricky walls, one steady hand.",
      rewardThreshold: 350,
    },
  ],

  // The in-page games' reward hook (DEMO — set your real offer)
  gameReward: {
    offer: "Beat the target score in any of our games and show it at the counter for a surprise bonus on your game card!",
  },
};

/* Video slots — drop real files at these paths and they appear automatically. */
const MEDIA = {
  promoVideo: "assets/promo.mp4",   // hero/“see it in action” video
  promoPoster: "",                  // optional poster image path
};
