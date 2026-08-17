import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071219",
        panel: "#0d1b23",
        aqua: "#22d3c5",
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 197, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
