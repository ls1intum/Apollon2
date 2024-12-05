// import eslint from "@eslint/js";
// import tseslint from "typescript-eslint";
// import prettierConfig from "eslint-config-prettier";

// export default tseslint.config(
//   eslint.configs.recommended,
//   tseslint.configs.strict,
//   tseslint.configs.stylistic,
//   prettierConfig
// );

import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // No `project` here since the root has no tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs.strict.rules,
      ...tseslint.configs.stylistic.rules,
      ...prettierConfig.rules,
    },
  },
];
