
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import router from '../../../../../config/routes'; // 导入您的路由配置

const { Item } = Breadcrumb;

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentRoute = router.find((route) => route.path === '/'+pathnames[0]);
  console.log('我是BreadcrumbComponent获取的路由信息：',router,pathnames,currentRoute,pathnames);
  if (!currentRoute) {
    return null;
  }

  return (
    <Breadcrumb>
      {currentRoute.routes.map((route, index) => {
        // const routePath = `/${pathnames[0]}${route.path}`;
        const routePath = `${route.path}`;
        const lastItem = index === currentRoute.routes.length - 1;
        console.log('我是routePath:',routePath);
        return lastItem ? (
          <Item key={route.path}>{'任务详情'}</Item>
        ) : (
          <Item key={route.path}>
            <Link to={routePath}>{route.name}</Link>
          </Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
