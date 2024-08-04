import { Navigate } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import { JobDetails } from "../pages/Jobs/JobDetails";
import Layout from "../pages/Layout";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export const CandidatesRoute = [
  {
    path: "/",
    element: <Navigate to="/signin/candidates" />,
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
    element: <Layout><JobDetails/></Layout>
  }
];
