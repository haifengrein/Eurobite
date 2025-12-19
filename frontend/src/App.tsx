import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { RequireAuth } from "./components/RequireAuth";
import { MobileShell } from "./layouts/MobileShell";

// C端页面
const HomePage = lazy(() => import("./pages/HomePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AddressListPage = lazy(() => import("./pages/AddressListPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Admin端页面和布局
import { AdminLayout } from "./admin/layouts";
import {
  AdminLoginPage,
  Dashboard,
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
} from "./admin/pages";

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-zinc-600">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* C端：桌面端也保持移动端宽度 */}
        <Route element={<MobileShell />}>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Tab Pages (With Bottom Nav) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
          </Route>

          {/* Full Screen Pages (No Bottom Nav) */}
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/addresses"
            element={
              <RequireAuth>
                <AddressListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoutes />
          }
        />
      </Routes>
    </Suspense>
  );
};

// Admin路由组件
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route path="dishes" element={<DishList />} />
        <Route path="dishes/new" element={<DishForm />} />
        <Route path="dishes/:id/edit" element={<DishForm />} />

        <Route path="setmeals" element={<SetmealList />} />
        <Route path="setmeals/new" element={<SetmealForm />} />
        <Route path="setmeals/:id/edit" element={<SetmealForm />} />

        <Route path="categories" element={<CategoryTree />} />
        <Route path="users" element={<UserList />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
