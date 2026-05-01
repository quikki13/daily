const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Указываем NativeWind, где лежит наш главный CSS файл
module.exports = withNativeWind(config, { input: "./global.css" });