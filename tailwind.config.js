/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Palette principale — tout passe par là
                lumin: {
                    bg: '#030712',        // fond principal
                    surface: '#0a1120',    // cards, sidebar
                    raised: '#111827',     // éléments surélevés
                    border: '#1e293b',     // bordures subtiles
                    'border-hover': '#334155',
                },
                accent: {
                    blue: '#3b82f6',
                    'blue-hover': '#60a5fa',
                    'blue-muted': 'rgba(59, 130, 246, 0.12)',
                    emerald: '#10b981',
                    'emerald-muted': 'rgba(16, 185, 129, 0.12)',
                    red: '#ef4444',
                    'red-muted': 'rgba(239, 68, 68, 0.10)',
                },
                text: {
                    primary: '#f1f5f9',
                    secondary: '#94a3b8',
                    muted: '#64748b',
                    faint: '#475569',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            fontSize: {
                'hero': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
                'hero-sm': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
                'heading': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
                'subheading': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
                'body': ['0.875rem', { lineHeight: '1.6' }],
                'caption': ['0.75rem', { lineHeight: '1.5' }],
                'micro': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.25rem',
                '4xl': '1.5rem',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
                'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
                'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
                'elevation-3': '0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}