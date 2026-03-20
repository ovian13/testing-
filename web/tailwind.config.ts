import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        newsreader: ['Newsreader', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#131313',
        surface: {
          lowest: '#080808',
          default: '#131313',
          low: '#1c1b1b',
          container: '#201f1f',
          high: '#2a2a2a',
          highest: '#353534',
          bright: '#3a3939',
        },
        primary: {
          DEFAULT: '#e6c364',
          container: '#c9a84c',
          on: '#3d2e00',
          fixed: '#ffe08f',
          dim: '#e6c364'
        },
        secondary: {
          DEFAULT: '#cac6be',
          fixed: '#e7e2da'
        },
        tertiary: {
          DEFAULT: '#ffb4a9',
          container: '#ff8a79'
        },
        outline: {
          DEFAULT: '#99907e',
          variant: '#4d4637'
        },
        on: {
          surface: '#e5e2e1',
          surfaceVariant: '#d0c5b2',
          tertiaryContainer: '#830905'
        }
      },
      borderRadius: {
        none: '0px',
      },
      boxShadow: {
        'golden-glow': '0 0 64px 0 rgba(230, 195, 100, 0.04)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #e6c364, #c9a84c)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
