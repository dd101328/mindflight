/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        flight: {
          ink: "#07152f",
          panel: "#0c2145",
          cyan: "#46d5ff",
          violet: "#8f6bff",
          mint: "#70f5cf",
        },
      },
      boxShadow: {
        glow: "0 0 36px rgba(70, 213, 255, 0.22)",
        violet: "0 0 42px rgba(143, 107, 255, 0.22)",
      },
    },
  },
  plugins: [],
};
