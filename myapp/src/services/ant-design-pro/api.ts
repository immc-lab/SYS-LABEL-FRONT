/*
 * @Author: yunxiang 2312119749@qq.com
 * @Date: 2023-10-30 20:55:26
 * @LastEditors: yunxiang 2312119749@qq.com
 * @LastEditTime: 2023-11-06 13:16:53
 * @FilePath: \test_AudioSystem\myapp\src\services\ant-design-pro\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  //request函数的第一个参数是请求的URL，第二个参数是一个对象，包含请求的配置信息
  return request<{
    data: API.CurrentUser;
  }>('/api/admin/core/getAdminMessage', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/core/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', //设置请求头，指定内容类型为JSON
    },
    data: body, //将body作为请求的数据发送
    ...(options || {}), //options是一个可选的对象，其键为字符串类型，值为任意类型，代表其它的配置项。
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(values:{}, options?: { [key: string]: any }) {
  console.log('我是addRule接收的参数values：',values) //我是addRule接收的参数： Object { name: "sdfs", desc: "dfd" }
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
