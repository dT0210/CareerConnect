import { httpClient } from "../httpClient/httpClient";

export const getPagedJobs = (request) => {
    const queryParams = new URLSearchParams(request);
    console.log(request);
    
    return httpClient.get(`/jobs?${queryParams}`);
}

export const getJobById = (id) => {
    return httpClient.get(`/jobs/${id}`);
}

export const createJob = (body) => {
    return httpClient.post("/jobs", body);
}

export const getSkills = () => {
    return httpClient.get("/skills");
}

export const getFields = () => {
    return httpClient.get("/fields");
}

export const applyJob = (body) => {
    return httpClient.post("/applications", body);
}