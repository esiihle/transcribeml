//transcribe/ transribe-app/uno.config.ts
import { defineConfig } from 'unocss'
import presetWind from '@unocss/preset-wind'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      collections: {
        'fa-solid': () => import('@iconify-json/fa-solid/icons.json').then(i => i.default),
      }
    }),
  ],
  shortcuts: {
    'special-btn': 'border border-blue-400 bg-blue-50 bg-opacity-20 hover:bg-opacity-30',
    'blue-shadow': 'shadow-xl shadow-blue-200/50',
  },
  theme: {
    extend: {
      animation: {
        loading0: 'loading 1.7s ease-in-out infinite alternate',
        loading1: 'loading 1.7s ease-in-out infinite alternate 0.2s',
        loading2: 'loading 1.7s ease-in-out infinite alternate 0.4s',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
      }
    }
  }
})