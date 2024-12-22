const plugin = require("tailwindcss/plugin");

const customPlugin = plugin(({ addBase, theme, addVariant, addUtilities }) => {
  addVariant("starting", "@starting-style");
  addVariant("popover-open", "&:popover-open");
  addVariant("popover-closed", "&:not(:popover-open)");
  addUtilities({ ".allow-discrete": { transitionBehavior: "allow-discrete" } });
  addBase({
    ":root": {
      "--color-secondary": theme("colors.red.500"),
    },
  });
});

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), customPlugin],
};
