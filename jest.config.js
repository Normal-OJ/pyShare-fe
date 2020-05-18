module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    transform: {
        '.+\\.(css|pug|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
    }
}