import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // imagem mínima no Docker: só o server.js + assets necessários
  output: "standalone",
};

export default nextConfig;
