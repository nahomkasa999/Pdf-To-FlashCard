import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.PNG"],
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"], // Ensures the worker is included in dependencies
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ["pdfjs-dist/build/pdf.worker.min.js"], // Splits the worker into a separate chunk
        },
      },
    },
  },
});
