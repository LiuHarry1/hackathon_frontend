import Vue from 'vue';
import VueRouter from 'vue-router';
import GlobalLayout from '@/layouts/GlobalLayout';

Vue.use(VueRouter);

// 定义了一个名为RouteView的组件，用于占位，通常用来渲染子路由。
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view'),
};

export const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Home' },
    redirect: '/race/list',
    component: GlobalLayout,
    children: [
      // module(race)
      {
        path: '/race',
        name: 'Race',
        redirect: '/race/list',
        component: RouteView,
        meta: { title: 'Module Management', icon: 'appstore' },
        children: [
          {
            path: '/race/list',
            name: 'RaceList',
            component: () => import('@/pages/race/Race'),
            meta: { title: 'Module List', auth: 'race:query' },
          },
          {
            path: '/race/record',
            name: 'Record',
            component: () => import('@/pages/race/Record'),
            meta: { title: 'My Modules old', auth: 'record:query' },
          },
          {
            path: '/race/mymodules',
            name: 'mymodules',
            component: () => import('@/pages/modules/MyModules'),
            meta: { title: 'My Modules', auth: 'record:query' },
          },
          {
            path: '/race/assignment',
            name: 'assignment',
            component: () => import('@/pages/modules/Assignments.vue'),
            meta: { title: 'Lesson Assignment', auth: 'record:query' },
          },
        ],
      },
      // user
      {
        path: '/user',
        redirect: '/user/student',
        name: 'User',
        component: RouteView,
        meta: { title: 'User Management', icon: 'user', auth: 'user:query' },
        children: [
          {
            path: '/user/student',
            name: 'Student',
            component: () => import('@/pages/user/Student'),
            meta: { title: 'Student List' },
          },
          {
            path: '/user/teacher',
            name: 'Teacher',
            component: () => import('@/pages/user/Teacher'),
            meta: { title: 'Teacher List' },
          },
        ],
      },
      // forum 
      {
        path: '/forum',
        redirect: '/forum/index',
        name: 'Forum',
        component: RouteView,
        meta: { title: 'Learning Forum', icon: 'user'},
        children: [
          {
            path: '/forum/index',
            name: 'ForumIndex',
            component: () => import('@/pages/forum/ForumIndex.vue'),
            meta: { title: 'Learning Forum' },
          },
          // 文章
          {
            path: '/forum/article/:articleId',
            name: 'Article',
            component: () => import('@/pages/forum/Article.vue'),
            meta: { title: 'Article',auth:'article' },
          },
        ],
      },
      // role
      {
        path: '/role',
        redirect: '/role/list',
        name: 'Role',
        component: RouteView,
        meta: { title: 'Permission Management', icon: 'key' },
        children: [
          {
            path: '/role/list',
            name: 'RoleList',
            meta: { title: 'Role List', auth: 'role:query' },
            component: () => import('@/pages/role/RoleList'),
          },
          {
            path: '/role/permission',
            name: 'Permission',
            meta: { title: 'Permission List', auth: 'permission:query' },
            component: () => import('@/pages/role/PermissionList'),
          },
        ],
      },
    ],
  },
  

  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: () => import('@/pages/Login'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: { title: 'Register' },
    component: () => import('@/pages/Register'),
  },
  {
    path: '/404',
    component: () => import('@/components/common/404'),
  },
  {
    path: '*',
    redirect: '/404',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * 根据权限过滤路由，生成pro-layout需要的menu
 * @param {[]} routes
 * @param {[]} permission 当前用户拥有的权限
 */
export function filterRoutes(routes, permission) {
  const set = new Set(permission);

  function filter(routes) {
    const arr = [];
    for (const route of routes) {
      const auth = route.meta?.auth;
      // 暂时隐藏文章
      if(auth ==='article'){
        route.hidden =true;
      }
      // 
      if (!auth || set.has(auth)) {
        arr.push(route);
        if (route.children) {
          const children = filter(route.children);
          route.children = children;
          if (!children.length) {
            route.hidden = true; // pro-layout隐藏菜单
          }
        }
      }
    }
    // return arr;
    return routes;
  }

  return filter(routes);
}

export default router;
