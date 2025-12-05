import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"logging/logger": "src/logging/logger.ts",
		"tracing/index": "src/tracing/index.ts",
	},
	format: ["esm"],
	dts: false, // Temporarily disable DTS generation - use tsc for type declarations
	clean: true,
	sourcemap: true,
	outDir: "dist",
	bundle: false, // Don't bundle the files
	splitting: false,
	treeshake: true,
	target: "es2022",
	skipNodeModulesBundle: true,
	external: ["next", "next/*", "next/headers", "next/server", "next/navigation", "react", "react-dom"],
});
