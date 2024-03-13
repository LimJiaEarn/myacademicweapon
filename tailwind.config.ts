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
        'teal_green': 'hsl(160, 40%, 70%)', // Navbar 
        'pri-bg-color': '#f9fafb', 
        'sec-bg-color': 'hsl(30, 20%, 90%)',
        'soft_sky_blue': 'hsl(200, 30%, 80%)', // Footer

        // Primary Colors (For headers, important buttons, links)
        'academic_red': 'hsl(0, 80%, 50%)', // A dynamic, attention-grabbing red for primary actions and headers
        'success_gold': 'hsl(46, 90%, 50%)', // A rich gold for highlighting success, achievements, and important features
        
        // Accent Colors (For secondary buttons, highlights, underlines)
        'insightful_silver': 'hsl(0, 0%, 75%)', // A neutral silver to complement red and gold, used for secondary elements and accents
        'creativity_gray': 'hsl(210, 16%, 60%)', // A soft gray for less dominant elements, ensuring content readability
        
        // Neutral Colors (For paragraphs, dividers, less important text)
        'text_gray': 'hsl(210, 10%, 40%)', // A darker gray for main text, ensuring good contrast and readability on the light background
        'light_text_gray': 'hsl(0, 0%, 80%)', // A very light gray for dividers and less prominent borders, maintaining a clean look
        
        // Utility Colors (For warnings, errors, info messages)
        'warning_orange': 'hsl(30, 100%, 50%)', // A vibrant orange for warnings, to stand out without clashing with red and gold
        'error_dark_red': 'hsl(0, 100%, 40%)', // A darker shade of red for errors, differentiating from the primary red
        'info_blue': 'hsl(210, 100%, 50%)', // A calming blue for informational messages, offering a contrast to the warm palette

        
        'earthy_brown': 'hsl(25, 50%, 50%)', // Approximation of Earthy Brown

      },
      keyframes: {
        "accordion-down": {
          from: { maxHeight: '0' },
          to: { maxHeight: '500px' } // Adjust max-height as per your requirement
        },
        "accordion-up": {
          from: { maxHeight: '500px' }, // Adjust max-height to match the 'down' animation
          to: { maxHeight: '0' }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config