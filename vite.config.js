import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        writingManagers: resolve(
          __dirname,
          "writing/best-managers-never-stop-being-ics.html",
        ),
        workArmory: resolve(__dirname, "work/winning-100cr-order.html"),
        workVida: resolve(__dirname, "work/vida-self-serve.html"),
        workSlice: resolve(__dirname, "work/slice-credit-card.html"),
        workProdigy: resolve(__dirname, "work/prodigy-authoring.html"),
      },
    },
  },
});
