const sass = require('node-sass');
module.exports = function (eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        'css',
        'html',
        'md',
    ]);
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/demos');
    eleventyConfig.addLiquidFilter('sass', function (sassContent) {
        return sass.renderSync({data: sassContent}).css;
    });
    eleventyConfig.addWatchTarget('src/index.scss');

    return {
        dir: {
            input: 'src',
            output: '_site',
        },
    };
};
