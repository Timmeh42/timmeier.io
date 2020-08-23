const sass = require('node-sass');
module.exports = function (eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        'html',
        'md',
    ]);
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addTransform('scss', function (content, outputPath) {
        if (outputPath && outputPath.endsWith('.css')) {
            let scssRender = sass.renderSync({data: content});
            return scssRender.css;
        }
        return content;
    });
    eleventyConfig.addWatchTarget('src/index.scss');

    return {
        dir: {
            input: 'src',
            output: '_site',
        },
    };
};
