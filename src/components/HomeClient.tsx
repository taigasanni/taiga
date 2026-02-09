"use client";

import HeroSection from "./HeroSection";
import WhatWeDoSection from "./WhatWeDoSection";
import LatestJournal from "./LatestJournal";
import BottomMessage from "./BottomMessage";

export default function HomeClient() {
  return (
    <div className="page-transition">
      <HeroSection />
      <WhatWeDoSection />
      <LatestJournal />
      <BottomMessage />
    </div>
  );
}
