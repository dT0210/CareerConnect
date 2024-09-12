import { Navigate } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import { Jobs } from "../pages/Jobs";
import { CreateJob } from "../pages/Jobs/CreateJob";
import { EditJob } from "../pages/Jobs/EditJob";
import { JobsApplications } from "../pages/Jobs/JobsApplications";
import Layout from "../pages/Layout";
import { Profile } from "../pages/Profile";
import { CreateCompanyProfile } from "../pages/Profile/CreateCompanyProfile";
import { EditCompanyProfile } from "../pages/Profile/EditCompanyProfile";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export const RecruitersRoute = [
  {
    path: "/recruiters",
    element: <Navigate to="/recruiters/dashboard" />,
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
    path: "/recruiters/profile/company/create",
    element: 
      <Layout>
        <CreateCompanyProfile/>
      </Layout>
  },
  {
    path: "/recruiters/profile/company/edit/:companyId",
    element: 
      <Layout>
        <EditCompanyProfile/>
      </Layout>
  },
  {
    path: "/recruiters/profile",
    element:
      <Layout>
        <Profile/>
      </Layout>
  },
  {
    path: "/recruiters/jobs",
    element:
      <Layout>
        <Jobs/>
      </Layout>
  },
  {
    path: "/recruiters/jobs/create",
    element:
      <Layout>
        <CreateJob/>
      </Layout>
  },
  {
    path: "/recruiters/jobs/:jobId",
    element: 
    <Layout>
      <JobsApplications/>
    </Layout>
  },
  {
    path: "/recruiters/jobs/edit/:jobId",
    element: 
    <Layout>
      <EditJob/>
    </Layout>
  }
];
