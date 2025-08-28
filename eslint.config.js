import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2020,
            },
            ecmaVersion: 2020,
            sourceType: "module",
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "no-console": "warn",
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-template": "error",
            "no-duplicate-imports": "error",
        },
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            sourceType: "module",
        },
    },
    {
        ignores: ["dist/**", "node_modules/**", ".husky/**"],
    }
);
