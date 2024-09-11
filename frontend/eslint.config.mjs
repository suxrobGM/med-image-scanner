import {fixupConfigRules} from "@eslint/compat";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import nextConfig from "eslint-config-next";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(nextConfig),
];
