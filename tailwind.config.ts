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
        // Background Colors
        'pri_orange_color': '#fef08a',
        'sec_orange_color': '##fde68a', 
        'pri_bg_color': '#f9fafb', 
        'pri_bg_card' : '#fefce8',
        'soft_sky_blue': 'hsl(200, 30%, 80%)', // Footer
        
        // Primary Colors (For headers, important buttons, links)
        'academic_red': 'hsl(0, 80%, 50%)', // A dynamic, attention-grabbing red for primary actions and headers
        'success_gold': 'hsl(46, 90%, 50%)', // A rich gold for highlighting success, achievements, and important features
        
        
        // Neutral Colors (For paragraphs, dividers, less important text)
        'light_gray': '#f3f4f6',
        'text_gray': 'hsl(210, 10%, 40%)', // A darker gray for main text, ensuring good contrast and readability on the light background
        'light_text_gray': 'hsl(0, 0%, 80%)', // A very light gray for dividers and less prominent borders, maintaining a clean look
        
        // Utility Colors (For warnings, errors, info messages)
        'vibrant_orange': 'hsl(30, 100%, 50%)', 
        'dark_red': 'hsl(0, 100%, 40%)', 
        'info_blue': 'hsl(210, 100%, 50%)', 
        'dark_info_blue': 'hsl(210, 100%, 30%)',
    
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