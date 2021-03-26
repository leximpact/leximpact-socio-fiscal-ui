module.exports = {
  env: { browser: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: [
    ".eslintrc.cjs",
    "build/**",
    "postcss.config.cjs",
    "prettier.config.cjs",
  ],
  overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
  parser: "@typescript-eslint/parser",
  plugins: ["svelte3", "@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
  },
  root: true,
  settings: {
    "svelte3/typescript": require("typescript"),
  },
}
