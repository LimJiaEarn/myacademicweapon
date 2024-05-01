import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {


        // Main Colors
        'pri_navy_main' : 'hsl(228.4, 41%, 32%)',
        'pri_mint_main' : 'hsl(177.4,76.9%,42%)',
        'pri_gold_main' : 'hsl(49.3,99%,61%)',
        'pri_red_main' : 'hsl(341.9,100%,50%)',

        // Main Colors' Palette

        // Navy
        'pri_navy_light': 'hsl(228.4, 41%, 42%)',
        'pri_navy_lighter': 'hsl(228.4, 41%, 52%)',   
        'pri_navy_dark': 'hsl(228.4, 41%, 22%)',
        'pri_navy_darker': 'hsl(228.4, 41%, 17%)',

        // Mint
        'pri_mint_light': 'hsl(177.4, 76.9%, 55%)',
        'pri_mint_lighter': 'hsl(177.4, 76.9%, 65%)',
        'pri_mint_lightest': 'hsl(177.4, 76.9%, 75%)',
        'pri_mint_dark': 'hsl(177.4, 76.9%, 44%)',
        'pri_mint_darker': 'hsl(177.4, 76.9%, 35%)',
        'pri_mint_darkest': 'hsl(177.4, 76.9%, 30%)',

        // Gold
        'pri_gold_light': 'hsl(49.3, 99%, 66%)',
        'pri_gold_lighter': 'hsl(49.3, 99%, 71%)',
        'pri_gold_dark': 'hsl(49.3, 99%, 56%)',
        'pri_gold_darker': 'hsl(49.3, 99%, 67%)',


        // Red
        'pri_red_light': 'hsl(341.9, 100%, 65%)',
        'pri_red_lighter': 'hsl(341.9, 100%, 75%)',
        'pri_red_dark': 'hsl(341.9, 100%, 35%)',
        'pri_red_darker': 'hsl(341.9, 100%, 25%)',

        // Support Colors
        'info_blue': 'hsl(210, 100%, 50%)',
        'bg_info_blue': 'hsla(210, 100%, 50%, 0.6)', 
        'dark_info_blue': 'hsl(210, 100%, 30%)',

        // Background Colors
        'pri_orange_color': '#fef08a',
        'sec_orange_color': '##fde68a', 
        'pri_bg_color': '#f9fafb', 
        'pri_nav_color': 'hsl(177.4, 76.9%, 46%)',
        'pri_bg_card' : 'hsla(177.4, 76.9%, 46%, 0.1)',
        'pri_bg_card2' : 'hsla(177.4, 76.9%, 46%, 0.2)',
        'soft_sky_blue': 'hsl(200, 30%, 80%)', // Footer


        // Bentobox Colours:
        'purple_bg': 'rgba(195, 178, 231, 0.72)',
        'purple_text': 'rgb(82, 34, 94)',

        'pink_bg': 'rgba(246, 130, 165, 0.72)',
        'pink_text': 'rgb(82, 34, 94)',

        'green_bg': 'rgba(201, 218, 143, 0.72)',
        'green_text': 'rgb(28, 71, 31)',

        'yellow_bg': ' rgba(254, 223, 111, 0.72)',
        'yellow_text': 'rgb(74, 65, 30)',

        'orange_bg': 'rgba(249, 164, 116, 0.72)',
        'orange_text': 'rgb(88, 38, 20)',

        'blue_bg': 'rgba(184, 206, 220, 0.72)',
        'blue_text': 'rgb(24, 67, 99)',

    
      },
      boxShadow: {
        // Custom shadow for dropdown
        'dropdown': '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config