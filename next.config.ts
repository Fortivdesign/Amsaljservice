import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dölj Next.js-märket i hörnet så att det inte syns på skärmdumpar
  devIndicators: false,
  // Skapa ingen AGENTS.md automatiskt
  agentRules: false,
};

export default nextConfig;
