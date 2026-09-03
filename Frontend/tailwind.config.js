/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          red: '#FF0000',
          dark: '#0F0F0F',
          secondary: '#606060',
          muted: '#909090',
          border: '#EAEAEA',
          hover: '#F2F2F2',
          active: '#E5E5E5',
        },
        pastel: {
          purple: {
            bg: '#F5F2FE',
            badge: '#EBE5FC',
            text: '#6941C6',
            border: '#D8CFF7'
          },
          peach: {
            bg: '#FFF1EB',
            badge: '#FEE4D7',
            text: '#E04F16',
            border: '#FCD2C1'
          },
          mint: {
            bg: '#EEF9F5',
            badge: '#D8F3E5',
            text: '#0E9F6E',
            border: '#B7ECD1'
          },
          blue: {
            bg: '#EFF6FF',
            badge: '#DBEAFE',
            text: '#1D4ED8',
            border: '#BFDBFE'
          },
          yellow: {
            bg: '#FEF9EC',
            badge: '#FEF0C7',
            text: '#B54708',
            border: '#FDE68A'
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'pill': '0 2px 6px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
