module.exports = {
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://121.36.205.112:8000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
  //反向代理，实际请求为target部分
}