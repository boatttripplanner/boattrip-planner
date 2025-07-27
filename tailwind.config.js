/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'sky': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        'slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gentle-wave': 'gentle-wave 10s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite alternate',
        'gentle-wave-2': 'gentle-wave 13s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite alternate',
        'gentle-wave-3': 'gentle-wave 16s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite alternate',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(20, 184, 166, 0.5)',
          },
          '70%': {
            boxShadow: '0 0 0 12px rgba(20, 184, 166, 0)',
          },
        },
        'gentle-wave': {
          'from': { transform: 'translateX(-20px)' },
          'to': { transform: 'translateX(20px)' },
        },
      },
    },
  },
  plugins: [],
} 