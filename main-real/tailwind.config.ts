import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a202c", // Example
        secondary: "#4a5568", // Example
        "gradient-theme": "linear-gradient(to right, #4a5568, #1a202c)", // Example
        "accent-primary": "#ed8936", // Example
        theme: "#e2e8f0", // Example
      },
    },
  },
  plugins: [],
} satisfies Config;
