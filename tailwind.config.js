/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          bg: '#F6F8FB',
          surface: '#FFFFFF',
          dark: '#0C2340',
          blue: '#123B5D',
          steel: '#2C5F7C',
          lightBlue: '#E8F1F8',
          teal: '#0FAF9A',
          tealLight: '#E6F8F5',
          amber: '#F59E0B',
          amberLight: '#FEF3C7',
          crimson: '#DC2626',
          crimsonLight: '#FEE2E2',
          purple: '#6D28D9',
          purpleLight: '#F5F3FF',
          border: '#E2E8F0',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        elevated: '0 4px 12px -2px rgba(18, 59, 93, 0.08), 0 2px 6px -1px rgba(18, 59, 93, 0.04)',
        popover: '0 10px 25px -5px rgba(18, 59, 93, 0.15), 0 8px 10px -6px rgba(18, 59, 93, 0.1)',
      }
    },
  },
  plugins: [],
}
