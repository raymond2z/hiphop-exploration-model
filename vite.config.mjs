import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "assets/audio",
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/audio/index.ts", import.meta.url)),
      name: "HipHopAudio",
      formats: ["iife"],
      fileName: () => "site-audio.js"
    }
  }
});
