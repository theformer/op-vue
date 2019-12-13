// vue.config.js
module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 3040,
    proxy: 'http://10.200.133.146:82'
  }
};