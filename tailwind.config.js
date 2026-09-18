import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "var(--gutter)",
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
        section: ["var(--font-section)"],
        note: ["var(--font-note)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        content: "var(--content)",
        board: "1440px",
      },
      height: {
        header: "var(--header-h)",
      },
      boxShadow: {
        "brut-sm": "var(--shadow-sm)",
        "brut-md": "var(--shadow-md)",
        brut: "6px 6px 0 var(--ink)",
        "brut-lg": "var(--shadow-lg)",
        "brut-press": "2px 2px 0 var(--ink)",
      },
      backgroundImage: {
        'register': "url('./assets/loginComp.svg')",
        'teamCard': "url('./assets/teamCard.svg')",
        'mailBg':"url('./assets/mail-bg.svg')"
      },
      colors: {
        paper: "var(--paper)",
        wcard: "var(--wcard)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink2)" },
        line: "var(--line)",
        acc: { DEFAULT: "var(--acc)", 2: "var(--acc2)" },
        term: { DEFAULT: "var(--term)", fg: "var(--termfg)" },
        r1: "var(--r1)",
        r2: "var(--r2)",
        r3: "var(--r3)",
        r4: "var(--r4)",
        r5: "var(--r5)",
        r6: "var(--r6)",
        r7: "var(--r7)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}