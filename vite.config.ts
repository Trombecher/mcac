import {defineConfig} from "vite";

export default defineConfig({
    esbuild: {
        jsxInject: "import {createElement, Fragment} from 'aena';"
    },
    base: "/mcac/"
});