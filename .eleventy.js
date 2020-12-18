const sass = require('node-sass');
const markdownIt = require('markdown-it');
const markdownItImsize = require('markdown-it-imsize');
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

    eleventyConfig.setLibrary('md', markdownIt({html: true}).use(markdownItImsize));

    return {
        dir: {
            input: 'src',
            output: 'docs',
        },
    };
};
