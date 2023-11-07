export default {
  //这是一个JavaScript对象，它定义了一个名为/api/auth_routes的路由，该路由下有一个子路由/form/advanced-form。
  //这个子路由的权限控制列表为['admin', 'user']，表示只有拥有'admin'或'user'权限的用户才能访问这个子路由
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },
};
