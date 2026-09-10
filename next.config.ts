import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // imagem mínima no Docker: só o server.js + assets necessários
  output: "standalone",
};

export default withNextIntl(nextConfig);
