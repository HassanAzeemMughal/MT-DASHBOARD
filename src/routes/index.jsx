import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Protected from "./protected";
import UsersList from "../screens/Users/index";
import UsersAdd from "../screens/Users/components/add";
import Store from "../screens/Store";
import Dashboard from "../screens/Dashboard/index";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import PageNotFound from "../screens/PageNotFound/PageNotFound";
import UserEdit from "../screens/Users/components/edit";
import RolesList from "../screens/Roles/index";
import RolesAdd from "../screens/Roles/components/add";
import RolesEdit from "../screens/Roles/components/edit";
import CategoryList from "../screens/Category/index";
import CategoryAdd from "../screens/Category/components/add";
import CategoryEdit from "../screens/Category/components/edit";
import ProductList from "../screens/Product/index";
import ProductAdd from "../screens/Product/components/add";
import ProductEdit from "../screens/Product/components/edit";
import BrandList from "../screens/Brand/index";
import BrandAdd from "../screens/Brand/components/add";
import BrandEdit from "../screens/Brand/components/edit";
import ForgotPassword from "../screens/Auth/ForgotPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot/password" element={<ForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users/list" element={<UsersList />} />
        <Route path="/users/add" element={<UsersAdd />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />

        <Route path="/roles/list" element={<RolesList />} />
        <Route path="/roles/add" element={<RolesAdd />} />
        <Route path="/roles/edit/:slug" element={<RolesEdit />} />

        <Route path="/category/list" element={<CategoryList />} />
        <Route path="/category/add" element={<CategoryAdd />} />
        <Route path="/category/edit/:id" element={<CategoryEdit />} />

        <Route path="/product/list" element={<ProductList />} />
        <Route path="/product/add" element={<ProductAdd />} />
        <Route path="/product/edit/:id" element={<ProductEdit />} />

        <Route path="/brand/list" element={<BrandList />} />
        <Route path="/brand/add" element={<BrandAdd />} />
        <Route path="/brand/edit/:id" element={<BrandEdit />} />
        <Route path="/store" element={<Store />} />
      </Route>
    </Route>
  )
);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export default Routers;
