/** 覆写webpack及其他一些的启动配置 */
const { override, addWebpackAlias, useBabelRc, useEslintRc } = require('customize-cra')
const path = require('path')

module.exports = override(
    /** 读取顶层的.babelrc文件 */
    useBabelRc(),
    useEslintRc('./.eslintrc.js'),
    /** 添加绝对引用 */
    addWebpackAlias({
        '@': path.resolve(__dirname, 'src'),
    }),
)
