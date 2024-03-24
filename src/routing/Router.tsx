import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'pages/Layout/Layout';
import MainPage from 'pages/MainPage/MainPage';
import UsersPage from 'pages/UsersPage/UsersPage';
import ErrorPage from 'pages/ErrorPage/ErrorPage';
import ResetPasswordPage from 'pages/ResetPasswordPage/ResetPasswordPage';
import ProfilePage from 'pages/ProfilePage/ProfilePage';
import { useAuth } from 'store/context/authContext';
import { Role } from 'utils/constants';
import ForgotPasswordPage from 'pages/ForgotPasswordPage/ForgotPasswordPage';
import CreateUserPage from 'pages/CreateUserPage/CreateUserPage';
import UpdateUserPage from 'pages/UpdateUserPage/UpdateUserPage';
import ProductsPage from 'pages/ProductsPage/ProductsPage';
import CreateProductPage from 'pages/CreateProductPage/CreateProductPage';
import LoginPage from 'pages/LoginPage/LoginPage';
import CatalogPage from 'pages/CatalogPage/CatalogPage';
import CatalogProductPage from 'pages/CatalogProductPage/CatalogProductPage';
import DashboardPage from 'pages/DashboardPage/DashboardPage';

const Router = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:id" element={<CatalogProductPage />} />
        <Route
          path="login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="login/admin"
          element={!user ? <LoginPage /> : <Navigate to="/app" replace />}
        />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        {/* <Route
          path="app"
          element={user ? <QuotePage /> : <Navigate to="/" replace />}
        /> */}
        {user === Role.ADMIN && <Route path="users" element={<UsersPage />} />}
        {user === Role.ADMIN && (
          <Route path="app" element={<DashboardPage />} />
        )}
        {user === Role.ADMIN && (
          <Route path="users/create" element={<CreateUserPage />} />
        )}
        {user === Role.ADMIN && (
          <Route path="users/:id" element={<UpdateUserPage />} />
        )}
        {/* {user === Role.ADMIN && (
          <Route path="components" element={<ComponentsPage />} />
        )}
        {user === Role.ADMIN && (
          <Route path="components/create" element={<CreateComponentPage />} />
        )}
        {user === Role.ADMIN && (
          <Route path="components/prices" element={<ComponentsPricesPage />} />
        )} */}
        {user === Role.ADMIN && (
          <Route path="products" element={<ProductsPage />} />
        )}
        {user === Role.ADMIN && (
          <Route path="products/create" element={<CreateProductPage />} />
        )}
        {user && <Route path="profile" element={<ProfilePage />} />}
      </Route>
      <Route path="404" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default Router;
