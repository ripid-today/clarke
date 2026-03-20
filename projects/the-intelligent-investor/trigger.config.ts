import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_eqmdhwislaqdiphplort",
  dirs: ["./trigger"],
  maxDuration: 1800, // 30 minutes (matches prior GitHub Actions timeout)
});
