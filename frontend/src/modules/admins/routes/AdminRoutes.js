import { Navigate } from "react-router-dom";
import { CompanyProfiles } from "../pages/CompanyProfiles";
import { DashBoard } from "../pages/DashBoard";
import Layout from "../pages/Layout";
import Signin from "../pages/Signin";

export const AdminsRoute = [
  {
    path: "/",
    element: <Navigate to="/signin/admin" />,
  },{
    path: "/signin/admin",
    element: <Signin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <Layout>
        <DashBoard />
      </Layout>
    ),
  },
  {
    path: "/admin/companies",
    element: (
      <Layout>
        <CompanyProfiles />
      </Layout>
    ),
  },
];
