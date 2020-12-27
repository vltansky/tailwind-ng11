module.exports = (config) => {
  const isProd = config.mode === "production";
  const tailwindConfig = require("./tailwind.config.js")(isProd);

  const globalStylesPostcssLoaderOptions = config.module.rules
  .find((r) => r.include && r.test && r.test.toString().includes('\\.scss$'))
  .use.find((u) => u.loader && u.loader.includes('postcss-loader')).options;

  const globalStylesPostcssOptionsCreator = globalStylesPostcssLoaderOptions.postcssOptions;

  globalStylesPostcssLoaderOptions.postcssOptions = (loader) => {
    const postcssOptions = globalStylesPostcssOptionsCreator(loader);
    postcssOptions.plugins.splice(postcssOptions.plugins.length - 1, 0, require('tailwindcss')(tailwindConfig));

    return postcssOptions;
  };
return config;
};
