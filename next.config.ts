import type { NextConfig } from "next";
import { LIMITED_REDIRECT_SOURCES } from "./src/lib/demoMode";

const nextConfig: NextConfig = {
  // Dölj Next.js-märket i hörnet så att det inte syns på skärmdumpar
  devIndicators: false,
  // Skapa ingen AGENTS.md automatiskt
  agentRules: false,
  // Spärrade visningslägen: sidor som inte är med skickas till startsidan
  async redirects() {
    return LIMITED_REDIRECT_SOURCES.map((source) => ({ source, destination: "/", permanent: false }));
  },
};

export default nextConfig;
