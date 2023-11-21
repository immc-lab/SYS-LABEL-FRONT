/*
 * @Author: yunxiang 2312119749@qq.com
 * @Date: 2023-10-30 20:55:24
 * @LastEditors: yunxiang 2312119749@qq.com
 * @LastEditTime: 2023-11-17 22:32:58
 * @FilePath: \test_AudioSystem\myapp\src\access.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  //这是一个对象解构赋值语句,{currentUser}表示要从initialState对象中提取currentUser赋值给currentUser。
  //如果initialState为null或undefined，则使用空对象{}作为默认值。
  const { currentUser } = initialState ?? {}; // 可选链操作符,如果某个属性不存在，不会抛出错误，而是返回undefined。
  console.log('我是initialState:',initialState,currentUser);
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}

/*
输出的currentUser:
Object {
name: "Serati Ma",
access: "admin"
address: "西湖区工专路 77 号"
avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
country: "China"
email: "antdesign@alipay.com"
geographic: Object { province: {…}, city: {…} }
group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED"
name: "Serati Ma"
notifyCount: 12
phone: "0752-268888888"
signature: "海纳百川，有容乃大"
tags: Array(6) [ {…}, {…}, {…}, … ]
title: "交互专家"
unreadCount: 11
userid: "00000001"
。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
*/
