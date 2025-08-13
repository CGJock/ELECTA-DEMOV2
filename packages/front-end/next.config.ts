import path from "path";
import type { NextConfig } from "next";

// Detectar si estamos en Windows
const isWindows = process.platform === "win32";

const nextConfig: NextConfig = {
  // Solo activar standalone en Linux (Vercel / CI)
  ...(isWindows ? {} : { output: "standalone" }),

  // Alias según tu tsconfig.json
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    config.resolve.alias["@wrappers"] = path.resolve(__dirname, "src/components/components-wrappers");
    config.resolve.alias["@components"] = path.resolve(__dirname, "src/components");
    config.resolve.alias["@contexts"] = path.resolve(__dirname, "src/context");
    config.resolve.alias["@data"] = path.resolve(__dirname, "src/data");
    config.resolve.alias["@translation"] = path.resolve(__dirname, "src/data/translate");
    config.resolve.alias["@maps"] = path.resolve(__dirname, "public/data/map");
    config.resolve.alias["@imgs"] = path.resolve(__dirname, "public/img");
    return config;
  },

  // Paquetes externos que se usan en server components (si los hubiera)
  serverExternalPackages: []
};

export default nextConfig;