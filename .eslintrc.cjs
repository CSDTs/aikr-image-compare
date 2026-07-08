/* eslint-env node */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2022: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
	settings: {
		react: {
			version: "18.2",
		},
	},
	ignorePatterns: ["dist", "past-build", "*.cjs"],
	rules: {
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react-refresh/only-export-components": "warn",

		// Pre-existing codebase style — tuned down so lint is usable without a
		// mass rewrite. Revisit as the code is gradually cleaned up.
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-empty-function": "off",
		// Dominant source of noise (~40 hits, mostly in src/lib/classifier/*, which
		// this pass is not allowed to touch); fixing it is a type-signature refactor,
		// not a lint-config task.
		"@typescript-eslint/ban-types": "off",
		"no-empty": "warn",
		"no-constant-condition": "warn",
	},
};
