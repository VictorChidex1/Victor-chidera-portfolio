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
  };
});
