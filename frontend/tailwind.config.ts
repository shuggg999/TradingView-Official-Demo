import type { Config } from "tailwindcss";
const plugin = require('tailwindcss/plugin');

const config: Config = {
  darkMode: "class", // 使用class策略支持主题切换
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 原有兼容性颜色
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

        // 新的主题系统颜色
        'theme-primary': {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)'
        },
        'theme-secondary': 'var(--color-secondary)',

        'theme-background': 'var(--color-background)',
        'theme-surface': 'var(--color-surface)',
        'theme-card': 'var(--color-card)',

        'theme-text': {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)'
        },

        'theme-success': 'var(--color-success)',
        'theme-danger': 'var(--color-danger)',
        'theme-warning': 'var(--color-warning)',
        'theme-info': 'var(--color-info)',

        'theme-border': 'var(--color-border)',
        'theme-divider': 'var(--color-divider)',

        // 图表专用颜色
        chart: {
          background: 'var(--color-chart-background)',
          grid: 'var(--color-chart-grid)',
          axis: 'var(--color-chart-axis)',
          up: 'var(--color-candle-up)',
          down: 'var(--color-candle-down)'
        }
      },

      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)'
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'theme-sm': 'var(--radius-sm)',
        'theme-md': 'var(--radius-md)',
        'theme-lg': 'var(--radius-lg)'
      },

      transitionDuration: {
        'theme-fast': '150ms',
        'theme-normal': '200ms',
        'theme-slow': '300ms'
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),

    // 自定义主题插件
    plugin(function ({ addUtilities, addComponents, theme }: any) {
      // 主题相关工具类
      addUtilities({
        '.theme-transition': {
          transition: 'var(--transition-normal)'
        },
        '.theme-transition-fast': {
          transition: 'var(--transition-fast)'
        },
        '.theme-transition-slow': {
          transition: 'var(--transition-slow)'
        }
      });

      // 主题相关组件类
      addComponents({
        '.theme-card': {
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        },

        '.theme-button': {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-background)',
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition-fast)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-hover)'
          }
        },

        '.theme-button-secondary': {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition-fast)',
          '&:hover': {
            backgroundColor: 'var(--color-card)'
          }
        },

        '.theme-input': {
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          borderRadius: 'var(--radius-sm)',
          '&:focus': {
            borderColor: 'var(--color-primary)',
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(0, 51, 102, 0.2)'
          },
          '&::placeholder': {
            color: 'var(--color-text-tertiary)'
          }
        },

        '.theme-select': {
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          borderRadius: 'var(--radius-sm)',
          '&:focus': {
            borderColor: 'var(--color-primary)',
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(0, 51, 102, 0.2)'
          }
        },

        '.theme-checkbox': {
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          '&:checked': {
            backgroundColor: 'var(--color-primary)',
            borderColor: 'var(--color-primary)'
          }
        }
      });
    })
  ],
};

export default config;