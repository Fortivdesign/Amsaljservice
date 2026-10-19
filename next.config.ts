import type { NextConfig } from "next";
import { LIMITED_DEMO, LIMITED_REDIRECT_SOURCES } from "./src/lib/demoMode";

const nextConfig: NextConfig = {
  // Dölj Next.js-märket i hörnet så att det inte syns på skärmdumpar
  devIndicators: false,
  // Skapa ingen AGENTS.md automatiskt
  agentRules: false,
  // Nedbantad version: bara startsidan och produktsidorna går att nå
  async redirects() {
    if (!LIMITED_DEMO) return [];
    return LIMITED_REDIRECT_SOURCES.map((source) => ({ source, destination: "/", permanent: false }));
  },
};

export default nextConfig;
