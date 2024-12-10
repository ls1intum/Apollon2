import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // Points to the backend tsconfig.json
      },
    },
  },
];
