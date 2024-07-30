import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks";

export const AuthRequired = ({children}) => {
    const {isAuthenticated, user, loading} = useAuth();

    if (loading) return <LoadingSpinner/>;

    return (
        isAuthenticated || user.type !== "recruiter" ? children : <Navigate to="/auth/login"/>
    );
};