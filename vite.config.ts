import {defineConfig} from "vite";

export default defineConfig({
    esbuild: {
        jsxInject: "import {createElement as _0, Fragment as _1} from 'aena/jsx-runtime';"
    }
});