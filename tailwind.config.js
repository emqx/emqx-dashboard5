/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  corePlugins: {
    // Disable preflight to avoid conflicts with Element Plus styles
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
