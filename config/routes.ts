export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/', name: '首页', icon: 'home', component: './Index' },
  {path: '/generator/add', name: '创建生成器', icon: 'plus', component: './Generator/Add' },
  {path: '/generator/update', name: '修改生成器', icon: 'plus', component: './Generator/Add', hideInMenu: true },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', name: '用户管理', component: './Admin/User' },
      { icon: 'tools', path: '/admin/generator', name: '生成器管理', component: './Admin/Generator' },
    ],
  },
  
  { path: '*', layout: false, component: './404' },
];
