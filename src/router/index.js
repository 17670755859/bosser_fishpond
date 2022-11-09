import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/list'
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [// roles 在此处添加才有效
  {
    path: '/dashboard',
    component: Layout,
    name: 'dashboard',
    meta: {
      icon: 'dashboard',
      title: '鱼塘管理',
      roles: ['editor', 'admin']
    },
    redirect: '/dashboard/fishponds',
    children: [
      {
        path: 'list',
        component: () => import('@/views/fish/fishponds'),
        name: 'FishPonds',
        meta: {
          title: '鱼塘列表',
          roles: ['editor', 'admin'],
          icon: 'list',
          affix: true
        }
      },
      {
        path: 'devicesinpond',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devicesinpond'),
        name: 'DevicesInPond',
        hidden: true,
        meta: { title: '鱼塘设备', icon: 'tree-table', affix: false }
      },
      {
        path: 'pondgroups',
        component: () => import('@/views/fish/fishpondgroups'),
        name: 'FishPondGroups',
        meta: {
          title: '鱼塘分组',
          noCache: true,
          roles: ['editor', 'admin'],
          icon: 'table',
          affix: false
        }
      },
      {
        path: 'fishpondsinpondgroup',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishpondsinpondgroup'),
        name: 'FishpondsInPondGroup',
        hidden: true,
        meta: { title: '分组中的鱼塘', icon: 'list', affix: false }
      },
    ]
  },
  {
    path: '/devices',
    component: Layout,
    meta: {
      icon: 'icon',
      title: '增氧机设备管理',
      roles: ['editor', 'admin']
    },
    redirect: '/devices/list',
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devices'),
        name: 'Devices',
        meta: { title: '设备列表', icon: 'nested', affix: false }
      },
      {
        path: 'devicegroups',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devicegroups'),
        name: 'FetchDeviceGroups',
        meta: { title: '设备分组', icon: 'tree', affix: false }
      },
      {
        path: 'devicesindevicegroup',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devicesindevicegroup'),
        name: 'DevicesInDeviceGroup',
        hidden: true,
        meta: { title: '设备分组中的设备', icon: 'list', affix: false }
      },
      {
        path: 'controllers',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/controllers'),
        name: 'Controllers',
        meta: { title: '群控器管理', icon: 'tree-table', affix: false }
      },
      {
        path: 'devicesincontroller',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devicesincontroller'),
        name: 'DevicesInController',
        hidden: true,
        meta: { title: '群控器关联的设备', icon: 'list', affix: false }
      },
    ]
  },
  {
    path: '/breedmgr',
    component: Layout,
    meta: {
      icon: 'list',
      title: '养殖管理',
      roles: ['editor', 'admin']
    },
    redirect: '/breedmgr/list',
    children: [
      {
        path: 'set',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/set'),
        name: 'Set',
        meta: { title: '导航设置', icon: 'edit', affix: false }
      },
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishputinrecord'),
        name: 'FishPutinRecord',
        meta: { title: '鱼苗投放', icon: 'edit', affix: false }
      },
      {
        path: 'n2',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishmedicinerecord'),
        name: 'FishMedicineRecord',
        meta: { title: '鱼药记录', icon: 'education', affix: false }
      },
      {
        path: 'n3',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/changewaterrecord'),
        name: 'ChangeWaterRecord',
        meta: { title: '换水记录', icon: 'excel', affix: false }
      },
      {
        path: 'n4',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/waterqualityrecord'),
        name: 'WaterQualityRecord',
        meta: { title: '水质记录', icon: 'list', affix: false }
      },
      {
        path: 'n5',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/diseaserecord'),
        name: 'DiseaseRecord',
        meta: { title: '病害情况', icon: 'bug', affix: false }
      },
      {
        path: 'n6',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/outputrecord'),
        name: 'OutputRecord',
        meta: { title: '出鱼管理', icon: 'link', affix: false }
      },
      {
        path: 'n7',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/sellrecord'),
        name: 'SellRecords',
        meta: { title: '产品流向', icon: 'drag', affix: false }
      },
      {
        path: 'n8',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/annualbenefitrecord'),
        name: 'AnnualBenefitRecord',
        meta: { title: '年效益表', icon: 'table', affix: false }
      },
      {
        path: 'n9',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/annualestimaterecord'),
        name: 'AnnualEstimateRecord',
        meta: { title: '年估计表', icon: 'tab', affix: false }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    meta: {
      icon: 'chart',
      title: '数据统计',
      roles: ['editor', 'admin']
    },
    redirect: '/statistics/list',
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/electricitystatistics'),
        name: 'ElectricityStatistics',
        meta: { title: '电量统计', icon: 'chart', affix: false }
      },
      {
        path: 'fishhealth',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishhealthrecord'),
        name: 'FishHealthRecord',
        meta: { title: '鱼类健康', icon: 'size', affix: false }
      },
      {
        path: 'nums',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/devicesNums'),
        name: 'FishHealthRecord',
        meta: { title: '设备数量', icon: 'example', affix: false }
      }
    ]
  },
  {
    path: '/videodevices',
    component: Layout,
    meta: {
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/videos'),
        name: 'RoomList',
        meta: { title: '实时视频设备', icon: 'tree-table', affix: false }
      }
    ]
  },
  {
    path: '/newsmgr',
    component: Layout,
    meta: {
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/news'),
        name: 'News',
        meta: { title: '常见问题', icon: 'nested', affix: false }
      }
    ]
  },
  {
    path: '/warnings',
    component: Layout,
    meta: {
      icon: 'message',
      title: '预警消息',
      roles: ['editor', 'admin']
    },
    redirect: '/warnings/list',
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/warnings'),
        name: 'Warnings',
        meta: { title: '消息列表', icon: 'email', affix: false }
      },
      {
        path: 'cases',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/cases'),
        name: 'Cases',
        meta: { title: '方案模板', icon: 'form', affix: false }
      }
    ]
  },
  {
    path: '/companyinfo',
    component: Layout,
    meta: {
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'info',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/companyinfo'),
        name: 'CompanyInfo',
        meta: { title: '公司信息', icon: 'documentation', affix: false }
      }
    ]
  },
  {
    path: '/suggestionmgr',
    component: Layout,
    meta: {
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/feedbacks'),
        name: 'Feedbacks',
        meta: { title: '意见管理', icon: 'guide', affix: false }
      }
    ]
  },
  {
    path: '/aftersales',
    component: Layout,
    meta: {
      icon: 'message',
      title: '售后管理',
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'video',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/aftersales'),
        name: 'AfterSales',
        meta: { title: '视频管理', icon: 'tree', affix: false }
      },
      {
        path: 'pdf',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/pdf'),
        name: 'Pdf',
        meta: { title: 'pdf管理', icon: 'tree', affix: false }
      }
    ]
  },
  {
    path: '/bannersmgr',
    component: Layout,
    meta: {
      roles: ['editor', 'admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/banners'),
        name: 'Banners',
        meta: { title: '轮播图管理', icon: 'component', affix: false }
      }
    ]
  },
  {
    path: '/bg',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/bg'),
        name: 'Bg',
        meta: { title: '背景图管理', icon: 'theme', affix: false }
      }
    ]
  },
  {
    path: '/managers',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/admins'),
        name: 'Admins',
        meta: { title: '子管理员', icon: 'people', affix: false }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    meta: {
      icon: 'user',
      title: '用户管理',
      roles: ['editor', 'admin']
    },
    redirect: '/users/list',
    children: [
      {
        path: 'list',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishers'),
        name: 'Fishers',
        meta: { title: '渔民管理', icon: 'people', affix: false }
      },
      {
        path: 'fishpondsforuserid',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishpondsforuserid'),
        name: 'FishpondsForUserid',
        hidden: true,
        meta: { title: '渔民鱼塘', icon: 'dashboard', affix: false }
      },
      {
        path: 'employees',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/employees'),
        name: 'Employees',
        meta: { title: '员工管理', icon: 'peoples', affix: false }
      },
      {
        path: 'employeesforbossid',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/employeesforbossid'),
        name: 'EmployeesForBossid',
        hidden: true,
        meta: { title: '渔民员工', icon: 'peoples', affix: false }
      },
      {
        path: 'fishpondgroupsforemployee',
        roles: ['editor', 'admin'],
        component: () => import('@/views/fish/fishpondgroupsforemployee'),
        name: 'FishpondGroupsForEmployee',
        hidden: true,
        meta: { title: '员工鱼塘组', icon: 'list', affix: false }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/logs',
    meta: {
      icon: 'setting',
      roles: ['editor', 'admin'],
      title: '系统管理'
    },
    children: [
      // {
      //   path: 'logs',
      //   component: () => import('@/views/fish/logs'),
      //   name: 'Logs',
      //   meta: { title: '系统日志', icon: 'bug', roles: ['editor', 'admin'] }
      // },
      {
        path: 'editpwd',
        component: () => import('@/views/fish/editpwd'),
        name: 'EditPwd',
        meta: { title: '修改密码', icon: 'lock', roles: ['editor', 'admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
