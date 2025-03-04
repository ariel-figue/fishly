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
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error", // or "warn" if you prefer
        {
          varsIgnorePattern: "^_", // Ignore variables starting with _
          argsIgnorePattern: "^_", // Ignore function arguments starting with _
        },
      ],
    },
  },
];

export default eslintConfig;