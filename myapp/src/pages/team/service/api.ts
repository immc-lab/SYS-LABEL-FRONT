// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

  export async function getAllTeam(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/team/core/getAllTeam', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
  }

  export async function saveOrUpdateTeam(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/team/core/saveOrUpDateTeam', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
  }

  export async function getAllManager(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/admin/core/getAllManager', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
  }

  export async function getAllUserByTeamKey(body:any,options?: { [key: string]: any }) {
    return request<Model.Result>('/api/admin/core/getAllUserByTeamKey', {
      method: 'POST',
      data:body,
      ...(options || {}),
    });
  }



