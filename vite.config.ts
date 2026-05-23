import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const frankfurterProxy = {
  "/api/frankfurter": {
    target: "https://api.frankfurter.app",
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api\/frankfurter/, ""),
  },
};

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT) || 5000;

  return defineConfig({
    plugins: [react()],
    server: {
      port,
      proxy: frankfurterProxy,
    },
    preview: {
      port,
      proxy: frankfurterProxy,
    },
  });
};
