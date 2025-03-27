import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
      extends: ['next'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // im not figuring out what type the error return is
        '@typescript-eslint/no-require-imports': 'off', // yeah sure let me just, copy paste the abi into the file right?
      }
  })
];

export default eslintConfig;
