import { useParams } from "react-router-dom";

export const JobDetails = () => {
    const {jobId} = useParams();

    return (
        <div>{jobId}</div>
    )
}