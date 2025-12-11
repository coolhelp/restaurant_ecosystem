import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#E85555',
          light: '#FF8787',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#3DB8AF',
          light: '#6FD9D1',
        },
        accent: {
          DEFAULT: '#FFE66D',
          dark: '#F5D752',
          light: '#FFF088',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
