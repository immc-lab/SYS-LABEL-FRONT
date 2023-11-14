// @ts-ignore
/* eslint-disable */

declare namespace Audio {

  type getAudioData = {
    key?:String
  };

  type AudioListRespones = {
    data?: AudioItem[];
    /** 列表的内容总数 */
    total?: number;
    current?:number;
    size?:number;
    pages?:number
  };

  type AudioItem = {
    key?:String
    format?:String
    creator?:String
    createTime?:String

  };
}
