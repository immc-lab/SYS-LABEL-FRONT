// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

//获取主模板


export   function getModelByKey(body:any,options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/getModelByKey', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}
export  async function getMainMode(options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/getMainModel', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/admin/core/getAdminMessage', {
    method: 'POST',
    ...(options || {}),
  });
}
//获取保存的编辑数据
export async function getSavedEditData(body:Label.getSaveEditDataRes ,options?: { [key: string]: any }) {
  return request<Label.getSaveEditDataReq>('/api/label/core/getSaveEditData', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

//保存和提交
export  function saveOrSubmitAudioData(body:Label.saveOrSubmitAudioDataRes ,options?: { [key: string]: any }) {
  return request<Label.Result>('/api/label/core/saveEditData', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}


//获取需要处理的语音数据

export async function getLabelAudioData(body:Label.LabelAudioRequest ,options?: { [key: string]: any }) {
  return request<Label.LabelAudioListRespones>('/api/label/core/getMusicLabelList', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

export async function allSubmit (body:Label.AllSubmitReq ,options?: { [key: string]: any }) {
  return request<Label.Result>('/api/label/core/audioLabelDataCommit', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}


export  function getLabelAudioDataByKey(body:Label.GetMusicResourceAndPlayReq ,options?: { [key: string]: any }) {
  return request<Label.LabelAudioListRespones>('/api/label/core/getLabelAudioDataByKey', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}


