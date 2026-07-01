/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // backoffice.dc.html theme tokens (line 26)
        bg: '#F5F3EF',
        card: '#FFFFFF',
        ink: '#28231D',
        muted: '#948C81',
        line: '#EAE4DA',
        soft: '#F3EFE8',
        accent: '#E4572E',
        accentSoft: 'rgba(228,87,46,.1)',
        ok: '#1F8A5B',
        okSoft: 'rgba(31,138,91,.12)',
        sky: '#2A6FDB',
        skySoft: 'rgba(42,111,219,.12)',
        amber: '#B26A00',
        amberSoft: 'rgba(178,106,0,.12)',
        del: '#D6402E',
        delSoft: 'rgba(214,64,46,.1)',
        // secondary body-text tone used across the original
        body: '#6b6355',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        adFade: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
        adSlideR: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'none' },
        },
        adPulse: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.35' },
        },
      },
      animation: {
        adFade: 'adFade .25s ease',
        adFadeFast: 'adFade .2s ease',
        adSlideR: 'adSlideR .3s cubic-bezier(.2,.8,.2,1)',
        adPulse: 'adPulse 1.2s infinite',
      },
    },
  },
  plugins: [],
}
