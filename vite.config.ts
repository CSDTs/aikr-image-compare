import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
	base: process.env.VITE_BASE ?? "./",
	server: {
		port: 3000,
	},
});
