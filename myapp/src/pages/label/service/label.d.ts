// @ts-ignore
/* eslint-disable */

declare namespace Label {

  type getSaveEditDataRes = {
    key?:String
  }

  type getSaveEditDataReq = {
    data?:getSaveEditDataItem

  }

  type getSaveEditDataItem = {
    id:?String
    labelText?:Strring
    talk?:String
    beginTime?:String
    endTime?:String
  }

  type LabelAudioRequest = {
    limit?:number
    size?:number
  }

  type AllSubmitReq = {
    data?: AllSubmitItem
  }

  type AllSubmitItem = {
    key?:String
    translation?:String
  }

  type Result = {
    status?:String
  }

  type saveOrSubmitAudioDataRes = {
    key?:String
    type?:String
    text?:String
    itemData?:saveOrSubmitAudioDataItem[]
  }

  type saveOrSubmitAudioDataItem = {
    id?:String
    areaText:?String
    talk:?String
    beginTime:?String
    endTime:?String
  }
  


  type LabelAudioListRespones = {
    data?: LabelMusicItem[];
    /** 列表的内容总数 */
    total?: number;
    current?:number;
    size?:number;
    pages?:number
  };

  type LabelMusicItem = {
    key?:String
    format?:String
    creator?:String
    createTime?:String

  }

  type GetMusicResourceAndPlayReq = {
    key:?String
  }


  

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
}

 
