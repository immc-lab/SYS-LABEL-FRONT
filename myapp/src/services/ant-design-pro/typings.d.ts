// @ts-ignore
/* eslint-disable */
/*
这个名为API的命名空间定义了多个类型(CurrentUser....等），用于描述信息。通过使用这个命名空间，
可以确保在程序中其他地方定义的同名变量或对象不会与该类型冲突。同时，使用命名空间还可以提高代码的可读性和可维护性。
*/
declare namespace API {
  type CurrentUser = {
    name?: string;
    teamKey?:string;
    state?:string;
    userAccount?:string;
    roles?:string;
    belongTeamKey?:string;
    belongTeamName?:string;
    rolesName?:string;
    manageTeamKey?:string;
    currentRole?:string;
    managerTeamItems?: ManagerTeamItem[];
    belongTeamItems?:ManagerTeamItem[]
  };

  type ManagerTeamItem = {
    teamKey?:string;
    teamName?:string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    message?:string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    account?: string;
    password?: string;
  };

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

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
