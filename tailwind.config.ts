import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        goodles: {
          pink: "#FF1493",
          yellow: "#FFE135",
          purple: "#9B59B6",
          lime: "#32CD32",
          orange: "#FF6B35",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      backgroundImage: {
        "goodles-gradient":
          "linear-gradient(135deg, #FF1493 0%, #FFE135 25%, #9B59B6 50%, #32CD32 75%, #FF6B35 100%)",
        "meter-gradient":
          "linear-gradient(to right, #32CD32 0%, #FFE135 50%, #FF6B35 75%, #FF1493 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
