import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // We will pass a specific mode 'gh-pages' when running the deploy script
  const isGitHubPages = mode === "gh-pages";

  return {
    plugins: [react()],
    // If it's GitHub Pages, use the repo name. If it's Vercel/Local, use root '/'.
    base: isGitHubPages ? "/my-portfolio/" : "/",
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return;
            if (id.includes("three") || id.includes("@react-three") || id.includes("zustand")) return "three";
            if (id.includes("react-simple-maps") || id.includes("d3") || id.includes("world-atlas") || id.includes("topojson")) return "maps";
            if (id.includes("firebase")) return "firebase";
          },
        },
      },
    },
  };
});
