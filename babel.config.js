
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Añade este plugin si usas expo-router v2 o superior
            'expo-router/babel',
        ],
    };
};