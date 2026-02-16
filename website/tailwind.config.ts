import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "claude-primary": "#C15F3C",
        "claude-secondary": "#B1ADA1",
        "cloud-dancer": "#F0EEE9",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          '"SF Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#000000",
            maxWidth: "768px",
            a: {
              color: "#0066CC",
              "&:hover": {
                color: "#004499",
              },
            },
            code: {
              backgroundColor: "#F5F5F5",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
