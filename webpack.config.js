function patchWebpackPostcssPlugins({
  webpackConfig,
  addPlugins = [],
  pluginName = null,
  append = false,
  atIndex = null,
  components = true,
  global = true,
}) {
  const position = append ? 1 : 0;
  for(const rule of webpackConfig.module.rules){
    if (!(rule.use && rule.use.length > 0) || (!components && rule.exclude) || (!global && rule.include)) {
      continue;
    }
    for(const useLoader of rule.use){
      if (!(useLoader.options && useLoader.options.postcssOptions)) {
        continue;
      }
      const originPostcssOptions = useLoader.options.postcssOptions;
      useLoader.options.postcssOptions = (loader) => {
        const _postcssOptions = originPostcssOptions(loader);
        const pluginIndex =
          atIndex !== null
            ? atIndex
            : _postcssOptions.plugins.findIndex(
                ({ postcssPlugin }) =>
                  postcssPlugin && pluginName && postcssPlugin.toLowerCase() === pluginName.toLowerCase()
              );
        if (pluginName && pluginIndex === -1) {
          console.warn(`${pluginName} not found in postcss plugins`);
        }
        const insertIndex =
          pluginIndex >= 0
            ? Math.min(Math.max(pluginIndex, 0), _postcssOptions.plugins.length)
            : _postcssOptions.plugins.length;
        _postcssOptions.plugins.splice(insertIndex + position, 0, ...addPlugins);
        return _postcssOptions;
      };
    }
  }
}

module.exports = (config) => {
  const isProd = config.mode === "production";
  const tailwindConfig = require("./tailwind.config.js")(isProd);
  patchWebpackPostcssPlugins({
    webpackConfig: config,
    addPlugins: [require("tailwindcss")(tailwindConfig)],
    pluginName: "autoprefixer",
    // global: false,
    // components: false,
    // atIndex: 2,
    // append: false,
  });
  return config;
};
