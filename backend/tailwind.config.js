import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', ...defaultTheme.fontFamily.sans],
                serif: ['IBM Plex Serif', ...defaultTheme.fontFamily.serif],
                label: ['Oswald', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                /* ── NGMS Brand Palette ── */
                'ngms-navy':      '#001b39',
                'ngms-navy-mid':  '#163051',
                'ngms-navy-dark': '#001c3a',
                'ngms-blue':      '#016686',
                'ngms-sky':       '#0072CE',
                'ngms-sky-light': '#93dbff',
                'ngms-sky-fixed': '#c0e8ff',
                'ngms-gold':      '#DFAC29',
                'ngms-gold-dim':  '#c99a20',
                'ngms-teal':      '#004d66',
                'ngms-teal-mid':  '#006180',

                /* ── Surface / Neutral ── */
                surface:          '#faf9fc',
                'surface-dim':    '#dbd9dd',
                'surface-bright': '#faf9fc',
                'surface-low':    '#f4f3f6',
                'surface-container': '#efedf1',
                'surface-high':   '#e9e7eb',
                'surface-highest':'#e3e2e5',
                'surface-variant':'#e3e2e5',
                'surface-alt':    '#F2F5F8',
                'on-surface':     '#1a1c1e',
                'on-surface-var': '#43474e',
                'surface-tint':   '#485f83',
                outline:          '#74777f',
                'outline-var':    '#c4c6cf',

                /* ── Shadcn-compatible aliases (keep existing portal working) ── */
                background:       'hsl(var(--background))',
                foreground:       'hsl(var(--foreground))',
                card: {
                    DEFAULT:    'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                muted: {
                    DEFAULT:    'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                border:  'hsl(var(--border))',
                input:   'hsl(var(--input))',
                ring:    'hsl(var(--ring))',
                primary: {
                    DEFAULT:    'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                sidebar: {
                    DEFAULT:            'hsl(var(--sidebar-background))',
                    foreground:         'hsl(var(--sidebar-foreground))',
                    primary:            'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent:             'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border:             'hsl(var(--sidebar-border))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(217 91% 60%) 50%, #0284c7 100%)',
            },
            animation: {
                'hero-zoom':       'heroZoom 14s ease-in-out infinite alternate',
                'scroll-partners': 'scrollPartners 32s linear infinite',
                'fade-in-up':      'fadeInUp 0.6s ease forwards',
                'slide-down':      'slideDown 0.3s ease forwards',
            },
            keyframes: {
                heroZoom: {
                    from: { transform: 'scale(1)' },
                    to:   { transform: 'scale(1.05)' },
                },
                scrollPartners: {
                    from: { transform: 'translateX(0)' },
                    to:   { transform: 'translateX(-50%)' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(24px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    from: { opacity: '0', transform: 'translateY(-8px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },

    plugins: [forms],
};
