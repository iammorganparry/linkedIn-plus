import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: env.mode !== "production" ? "[DEV] LinkedIn Plus" : "LinkedIn Plus",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  description: "Enhance your LinkedIn experience",
  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/main.tsx"],
      matches: ["https://www.linkedin.com/*"],
    },
  ],
}));
