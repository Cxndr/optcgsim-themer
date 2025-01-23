import type { Config } from "tailwindcss";
import daisyui from "daisyui"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      '2xl': '1600px',
    },
    extend: {
      backgroundImage: {
        'sea-main': "url('/img/bg-03.webp')",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          // "primary": "#fb7185",  
          "primary": "#ef4444",  
          "primary-content": "#f3f4f6",
          "secondary": "#3b82f6",
          "secondary-content": "#f3f4f6",
          "accent": "#eab308",
          "accent-content": "#f3f4f6",
          "neutral": "#1f2937",
          "neutral-content": "#cdd0d3",
          "base-100": "#f3f4f6",
          "base-200": "#d3d4d6",
          "base-300": "#b4b5b7",
          "base-content": "#141415",
          "info": "#38bdf8",
          "info-content": "#111827",
          "success": "#70cf73", //"#34d399",            
          "success-content": "#111827",
          "warning": "#facc15",
          "warning-content": "#150f00",
          "error": "#ef4444",
          "error-content": "#140202",
          "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "1.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s", // duration of animation when you click on button
          "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          "--border-btn": "1px", // border width of buttons
          "--tab-border": "1px", // border width of tabs
          "--tab-radius": "0.5rem", // border radius of tabs
          },
      }
    ],
    darkTheme: "dark",
    base: false,  
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  }
};
export default config;
