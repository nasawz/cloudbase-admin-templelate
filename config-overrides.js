const { override, fixBabelImports, addLessLoader, disableEsLint } = require("customize-cra");
const { getThemeVariables } = require("antd/dist/theme");

module.exports = override(
    disableEsLint(),
    fixBabelImports("import", {//antd按需加载
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    addLessLoader({
        lessOptions: {
            modifyVars: getThemeVariables({
                // dark: true, // 开启暗黑模式
                compact: false, // 开启紧凑模式
            }),
            javascriptEnabled: true,
            cssModules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
        },
    }),
);