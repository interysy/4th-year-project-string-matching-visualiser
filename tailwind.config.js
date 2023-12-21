/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      textColor : {
        skin : {
          base : "var(--color-text-base)",
          secondary : "var(--color-text-secondary)",
          tertiary : "var(--color-text-tertiary)",
          github : "var(--color-text-github)",
          icon : "var(--color-icon)",
          "icon-hover" : "var(--color-icon-hover)",
          "icon-disabled": "var(--color-icon-disabled)",
        }
      },
      backgroundColor : {
        skin : {
          "fill-main" : "var(--color-fill-main)",
          "fill-secondary" : "var(--color-fill-secondary)",
          "fill-tertiary" : "var(--color-fill-tertiary)",
          "fill-tertiary-hover" : "var(--color-fill-tertiary-hover)",
          "fill-quaternary" : "var(--color-fill-quaternary)",
        }
      },
      borderColor : {
        skin : {
          "icon-separator" : "var(--color-icon-seperator)",
          "border-focus" : "var(--color-border-focus)",
        }
      },
      ringColor : {
        skin : {
          "focus" : "var(--color-ring-focus)",
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require("tw-elements/dist/plugin.cjs"),
  ]
}