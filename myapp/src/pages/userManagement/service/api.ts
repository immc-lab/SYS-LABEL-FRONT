// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

  export async function saveNewUser(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/admin/core/saveOrUpdateNewUser', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
    
  } 


  export async function getAllUser(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/admin/core/getAllUser', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
    
  } 


