module.exports = (config) => {
  const isProd = config.mode === "production";
  const tailwindConfig = require("./tailwind.config.js")(isProd);

  config.module.rules.map(rule=>{
    if(rule.use && rule.use.length > 0){
      rule.use.map(useLoader => {
        if(useLoader.options && useLoader.options.postcssOptions){
          const postcssOptions = useLoader.options.postcssOptions;
          useLoader.options.postcssOptions = (loader) => {
            const _postcssOptions = postcssOptions(loader);
            const autoprefixerIndex = _postcssOptions.plugins.findIndex(v=>v.postcssPlugin === 'autoprefixer');
            if(autoprefixerIndex){
              _postcssOptions.plugins.splice(autoprefixerIndex, 0, require('tailwindcss')(tailwindConfig));
            }
            return _postcssOptions;
          }
        }
        return useLoader;
      })
    }
    return rule;
  });
  return config;
};
