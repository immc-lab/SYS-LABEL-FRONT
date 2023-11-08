// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/admin/core/getAdminMessage', {
    method: 'POST',
    ...(options || {}),
  });
}


export async function applyByKey(body:Model.deleteModelByKeyReq,options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/applyByKey', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

export async function getModelByKey(body:Model.deleteModelByKeyReq,options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/getModelByKey', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

export async function deleteModelByKey(body:Model.deleteModelByKeyReq,options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/deleteModelByKey', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}

export async function getAllModel(options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/getModelAll', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function SaveModelData(body:Model.SaveModelDataRes ,options?: { [key: string]: any }) {
  return request<Model.Result>('/api/model/core/saveModelData', {
    method: 'POST',
    data:body,
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
export async function saveOrSubmitAudioData(body:Label.saveOrSubmitAudioDataRes ,options?: { [key: string]: any }) {
  return request<Label.Result>('/api/label/core/saveOrSubmitLabelData', {
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


export async function getLabelAudioDataByKey(body:Label.GetMusicResourceAndPlayReq ,options?: { [key: string]: any }) {
  return request<Label.LabelAudioListRespones>('/api/label/core/getLabelAudioDataByKey', {
    method: 'POST',
    data:body,
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
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
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
export async function addRule(options?: { [key: string]: any }) {
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
