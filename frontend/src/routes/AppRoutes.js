import { useRoutes } from "react-router-dom";
import { AdminsRoute } from "../modules/admins/routes/AdminRoutes";
import { CandidatesRoute } from "../modules/candidates/routes/CandidatesRoutes";
import { RecruitersRoute } from "../modules/recruiters/routes/RecruitersRoutes";

const AppRoutes = () => {
  const elements = useRoutes([...CandidatesRoute, ...RecruitersRoute, ...AdminsRoute]);
  return elements;
};

export default AppRoutes;
