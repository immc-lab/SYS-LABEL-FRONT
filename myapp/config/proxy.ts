/*
 * @Author: yunxiang 2312119749@qq.com
 * @Date: 2023-10-30 20:27:04
 * @LastEditors: yunxiang 2312119749@qq.com
 * @LastEditTime: 2023-11-21 20:17:45
 * @FilePath: \test_AudioSystem\myapp\config\proxy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {

  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      // 要代理的地址
      target: 'http://192.168.4.249:8081',

      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/api': '' },

    },


    // '//': {
    //   target: 'https://proapi.azurewebsites.net',
    //   changeOrigin: true,
    //   pathRewrite: { '^': '' },
    // },
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  // test: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     target: 'https://proapi.azurewebsites.net',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
