import { Navigate } from "react-router-dom";
import { DashBoard } from "../pages/DashBoard";
import { JobDetails } from "../pages/JobDetails";
import Layout from "../pages/Layout";
import { CompanyProfiles } from "../pages/Manage/CompanyProfiles";
import { Fields } from "../pages/Manage/Fields";
import { Reports } from "../pages/Manage/Reports";
import { Skills } from "../pages/Manage/Skills";
import Signin from "../pages/Signin";
import Statistic from "../pages/Statistic";

export const AdminsRoute = [
  {
    path: "/",
    element: <Navigate to="/signin/admin" />,
  },
  {
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
  {
    path: "/admin/skills",
    element: (
      <Layout>
        <Skills />
      </Layout>
    ),
  },
  {
    path: "/admin/fields",
    element: (
      <Layout>
        <Fields />
      </Layout>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <Layout>
        <Reports />
      </Layout>
    ),
  },
  {
    path: "/admin/jobs/:jobId",
    element: (
      <Layout>
        <JobDetails />
      </Layout>
    ),
  },
  {
    path: "/admin/statistic",
    element: (
      <Layout>
        <Statistic />
      </Layout>
    ),
  },
];
