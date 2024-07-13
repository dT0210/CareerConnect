import { useRoutes } from "react-router-dom";
import { CandidatesRoute } from "../modules/candidates/routes/CandidatesRoutes";
import { RecruitersRoute } from "../modules/recruiters/routes/RecruitersRoutes";

const AppRoutes = () => {
  const elements = useRoutes([...CandidatesRoute, ...RecruitersRoute]);
  return elements;
};

export default AppRoutes;
