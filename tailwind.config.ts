import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      flex: {
        2: '1 1 25%',
        3: '1 1 30%',
        4: '1 1 40%',
        5: '1 1 50%',
        6: '1 1 60%',
      },
      
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
