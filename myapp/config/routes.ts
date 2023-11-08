

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin', // 会调用 src/access.ts 中返回的canAdmin 进行鉴权
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'basic-list',
    icon: 'table',
    path: '/basic-list',
    component: './BasicList',
  },
  {
    name: '团队管理',
    icon: 'table',
    path: '/teamManagement',
    // component: './TeamManagement/TeamTaskManagement',
    routes: [
      {
        path: '/teamManagement',
        redirect: '/teamManagement/teamTaskManagement',
      },
      {
        path: '/teamManagement/teamTaskManagement', //这个teamManagement要和path: '/teamManagement'一致
        name: '团队任务管理',
        component: './TeamManagement/TeamTaskManagement',
      },
      {
        path: '/teamManagement/accountManagement', //这个teamManagement要和path: '/teamManagement'一致
        name: '账号管理',
        component: './TeamManagement/AccountManagement',
      },
    ],
  },
  {
    name: '标注模块',
    icon: 'table',
    path: '/annotationModule',
    routes: [
      {
        path: '/annotationModule',
        redirect: '/annotationModule/annotationTaskList',
      },
      {
        path: '/annotationModule/annotationTaskList',
        // redirect: '/annotationModule/annotationTaskList',
        name: '标注任务列表',
        // component: './AnnotationModule',
        routes: [
          {
            path: '/annotationModule/annotationTaskList',
            component: './AnnotationModule',
          },
          {
            path: '/annotationModule/annotationTaskList/annotationDetail',
            name: '标注任务详情',
            component: './AnnotationModule/AnnotationTaskList/components/AnnotationDetail', //
            hideInMenu: true //可以在菜单中不展示这个路由，包括子路由
          },
          {
            path: '/annotationModule/annotationTaskList/annotationPage',
            name: '标注界面',
            component: './AnnotationModule/AnnotationTaskList/components/AnnotationPage',
            hideInMenu: true //可以在菜单中不展示这个路由，包括子路由
          },
        ],
      },

      {
        path: '/annotationModule/qualityInspectTaskList',
        name: '质检任务列表',
        // component: './AnnotationModule/QualityInspectionTaskList',
        routes: [
          {
            path: '/annotationModule/qualityInspectTaskList',
            component: './AnnotationModule/QualityInspectionTaskList',
          },
          {
            path: '/annotationModule/qualityInspectTaskList/qualityInspectTaskDetail',
            name: '质检任务详情',
            component: './AnnotationModule/QualityInspectionTaskList/components/QualityInspectTaskDetail', //
            hideInMenu: true //可以在菜单中不展示这个路由，包括子路由
          },
          {
            path: '/annotationModule/qualityInspectTaskList/qualityInspectPage',
            name: '质检界面',
            component: './AnnotationModule/QualityInspectionTaskList/components/QualityInspectPage',
            hideInMenu: true //可以在菜单中不展示这个路由，包括子路由
          },
          {
            path: '/annotationModule/qualityInspectTaskList/batchOperationRecords',
            name: '批量操作记录',
            component: './AnnotationModule/QualityInspectionTaskList/components/BatchOperationRecords',
            hideInMenu: true //可以在菜单中不展示这个路由，包括子路由
          },
        ],
      },


    ],
  },

  {
    path: '/label',
    name: '标注',
    icon: 'smile',
    component:"./label"

  },

  {
     path: '/model',
     name: '模板',
     icon: 'smile',
     routes: [
      {
      path: '/model',
      redirect: '/model/list',
      },
      {
      path:'/model/list',
      component:'./model/model_list'
      },
      {
      path:'/model/detail',
      component:'./model/model_detail'
      }
    ]
  },



  {
    name: '个人中心',
    icon: 'crown',
    path: '/personalCenter',
    component: './PersonalCenter',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
