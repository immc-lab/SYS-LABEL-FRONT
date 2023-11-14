import { request } from '@umijs/max';


export async function getAudioData(body:Audio.getAudioData ,options?: { [key: string]: any }) {
  // console.log('执行了getAudioData方法')
  return request<Audio.AudioListRespones>('/api/label/core/getMusicLabelList', {
    method: 'POST',
    data:body,
    ...(options || {}),
  });
}
