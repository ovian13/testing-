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
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        neutral: {
          50: '#F9FAFB',
          900: '#111827',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
