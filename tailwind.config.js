function generateColors(colors) {
    const obj = {};
    for(const color of colors)
        obj[color] = `var(--${color})`;
    return obj;
}

/** @type {import("tailwindcss").Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.tsx"
    ],
    theme: {
        colors: generateColors(["shade-0", "shade-1", "shade-2", "shade-3", "shade-4"])
    }
};