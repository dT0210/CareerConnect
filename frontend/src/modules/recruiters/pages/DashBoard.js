import { useNavigate } from "react-router-dom";

const DashBoard = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4">
            Dash Board
            <button className="bg-[#ff4545] block p-2 text-white font-semibold rounded-md"
                onClick={()=>{navigate("/recruiters/jobs/create")}}
            >
                Create a Job recruit
            </button>
            <button className="bg-[#ff4545] block p-2 text-white font-semibold rounded-md"
                onClick={()=>navigate("/recruiters/profile/company/create")}
            >
                Create a Company profile
            </button>
        </div>
    );
};

export default DashBoard;