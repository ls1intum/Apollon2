import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.{ts,tsx}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  reactPlugin.configs.flat["jsx-runtime"], // Add this if you are using React 17+
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
