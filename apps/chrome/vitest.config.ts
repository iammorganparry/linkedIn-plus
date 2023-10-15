import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    alias: {
      "@": "src",
    },
    globals: true,
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "__tests__/**/*.test.ts",
      "__tests__/**/*.test.tsx",
    ],
    setupFiles: ["./setupTests.ts"],
  },
});
