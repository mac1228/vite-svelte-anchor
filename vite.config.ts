import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import inject from "@rollup/plugin-inject";
import * as path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $utils: path.resolve("src/utils/"),
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        inject({ Buffer: ["buffer", "Buffer"] }),
        nodePolyfills({ crypto: true }),
      ],
    },
  },
  optimizeDeps: {
    include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
});
