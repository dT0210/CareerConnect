import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks";

export const AuthRequired = ({children}) => {
    const {isAuthenticated, user, loading} = useAuth();

    if (loading) return <LoadingSpinner/>;
    if (!isAuthenticated) {
        toast.info("Please Sign in to continue");
    }
    console.log(isAuthenticated);
    console.log(user);
    

    return (
        isAuthenticated && user.type === "recruiter" ? children : <Navigate to="/signin/recruiters"/>
    );
};