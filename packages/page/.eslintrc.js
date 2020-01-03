// 覆写eslint的配置
module.exports = {
    extends: 'react-app',
    rules: {
        // 不检查未使用变量
        '@typescript-eslint/no-unused-vars': 'off',
    },
}
