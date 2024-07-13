import { Navigate } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import { CreateJob } from "../pages/Jobs/CreateJob";
import Layout from "../pages/Layout";
import { CreateCompanyProfile } from "../pages/Profile/CreateCompanyProfile";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export const RecruitersRoute = [
  {
    path: "/recruiters",
    element: <Navigate to="/signin/recruiters" />,
  },
  {
    path: "/recruiters/dashboard",
    element: (
      <Layout>
        <DashBoard />
      </Layout>
    ),
  },
  {
    path: "/signin/recruiters",
    element: <Signin />,
  },
  {
    path: "/signup/recruiters",
    element: <Signup />,
  },
  {
    path: "/recruiters/jobs/create",
    element: <CreateJob/>
  },
  {
    path: "/recruiters/profile/company/create",
    element: 
      <Layout>
        <CreateCompanyProfile/>
      </Layout>
  }
];
