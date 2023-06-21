/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./server/views/**/*.html",
        "./server/views/**/*.ejs",
        "./public/css/**/*.css",
    ],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: '#E51F28',
            }
        },
    },
    plugins: [require('tailwindcss'), require('autoprefixer')],
}

