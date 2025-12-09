import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import React from 'react';

// Import admin pages and layouts
import {
  Dashboard,
  AdminLoginPage,
  OrderList,
  OrderDetail,
  DishList,
  DishForm,
  SetmealList,
  SetmealForm,
  CategoryTree,
  UserList,
  EmployeeList,
  Settings,
} from '../pages';
import { AdminLayout } from '../layouts';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <React.Suspense fallback={<div>加载中...</div>}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <OrderList />
              </React.Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <OrderDetail />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'dishes',
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <DishList />
              </React.Suspense>
            ),
          },
          {
            path: 'new',
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <DishForm />
              </React.Suspense>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <DishForm />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'setmeals',
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <SetmealList />
              </React.Suspense>
            ),
          },
          {
            path: 'new',
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <SetmealForm />
              </React.Suspense>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <React.Suspense fallback={<div>加载中...</div>}>
                <SetmealForm />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: 'categories',
        element: (
          <React.Suspense fallback={<div>加载中...</div>}>
            <CategoryTree />
          </React.Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <React.Suspense fallback={<div>加载中...</div>}>
            <UserList />
          </React.Suspense>
        ),
      },
      {
        path: 'employees',
        element: (
          <React.Suspense fallback={<div>加载中...</div>}>
            <EmployeeList />
          </React.Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <React.Suspense fallback={<div>加载中...</div>}>
            <Settings />
          </React.Suspense>
        ),
      },
    ],
  },
];

export const getAdminRoutes = () => {
  return adminRoutes;
};

export const getProtectedRoutes = () => {
  const protectedPaths = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/dishes',
    '/admin/setmeals',
    '/admin/categories',
    '/admin/users',
    '/admin/employees',
    '/admin/settings',
  ];
  return protectedPaths;
};
