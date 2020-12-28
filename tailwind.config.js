module.exports = (isProd) => ({
    prefix: '',
    purge: {
      enabled: isProd,
      content: [
        '**/*.html',
        '**/*.ts',
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          primary: "#6332f6",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
});
