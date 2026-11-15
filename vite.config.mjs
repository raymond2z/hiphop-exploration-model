import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const sourcePath = file => fileURLToPath(new URL(`./src/${file}`, import.meta.url));

export default defineConfig({
  root: sourcePath(""),
  base: "./",
  build: {
    outDir: "../dist",
    assetsDir: "assets/site",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: sourcePath("index.html"),
        possibilities: sourcePath("possibilities.html"),
        vocabulary: sourcePath("vocabulary.html")
      }
    }
  }
});
