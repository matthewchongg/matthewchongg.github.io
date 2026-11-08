/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#050506',
        charcoal: {
          950: '#09090b',
          900: '#101013',
          800: '#16161a',
          700: '#222228',
          600: '#2e2e36',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.07) 0%, rgba(16, 16, 19, 0) 70%)',
        'metallic-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.4) 100%)',
      },
      boxShadow: {
        'hardware': '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'hardware-hover': '0 30px 80px -10px rgba(255, 255, 255, 0.12), 0 0 1px 1px rgba(255, 255, 255, 0.28)',
      },
    },
  },
  plugins: [],
};
