/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f8f8f4',
          ivory: '#F7F7F2',
          navy: '#183247',
          teal: '#187C78',
          'teal-hover': '#126763',
          'teal-light': '#F1F5F4',
          slate: '#667085',
          border: '#E5E7EB',
          subtle: '#F9FAFB',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(24, 50, 71, 0.05), 0 1px 2px 0 rgba(24, 50, 71, 0.03)',
        card: '0 4px 6px -1px rgba(24, 50, 71, 0.05), 0 2px 4px -1px rgba(24, 50, 71, 0.03)',
        modal: '0 20px 25px -5px rgba(24, 50, 71, 0.1), 0 10px 10px -5px rgba(24, 50, 71, 0.04)',
      },
      borderRadius: {
        'corporate': '10px',
      }
    },
  },
  plugins: [],
}
