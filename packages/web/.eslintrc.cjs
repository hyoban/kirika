const path = require("path")

module.exports = {
	root: true,
	extends: ["next/core-web-vitals", "plugin:tailwindcss/recommended"],
	plugins: ["tailwindcss"],
	settings: {
		tailwindcss: {
			callees: ["cn"],
			config: path.resolve(__dirname, "./tailwind.config.js"),
		},
		next: {
			rootDir: ["./"],
		},
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
		},
	],
}
