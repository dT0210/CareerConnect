import { Navigate } from "react-router-dom";
import { AuthRequired } from "../components/AuthRequired";
import CompanyProfile from "../pages/CompanyProfile";
import DashBoard from "../pages/DashBoard";
import { AppliedJobs } from "../pages/Jobs/AppliedJobs";
import { JobDetails } from "../pages/Jobs/JobDetails";
import Layout from "../pages/Layout";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export const CandidatesRoute = [
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <DashBoard />
      </Layout>
    ),
  },
  {
    path: "/signin/candidates",
    element: <Signin />,
  },
  {
    path: "/signup/candidates",
    element: <Signup />,
  },
  {
    path: "/jobs/:jobId",
    element: (
      <Layout>
        <JobDetails />
      </Layout>
    ),
  },
  {
    path: "/applied-jobs",
    element: (
      <Layout>
        <AuthRequired>
        <AppliedJobs />
        </AuthRequired>
      </Layout>
    ),
  },
  {
    path: "/companies/:companyId",
    element: (
      <Layout>
        <CompanyProfile/>
      </Layout>
    )
  }
];
