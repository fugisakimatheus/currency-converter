import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return defineConfig({
    plugins: [react()],
    define: {
      "process.env": process.env,
    },
    server: {
      port: parseInt(process.env.APP_PORT),
    },
  });
};
