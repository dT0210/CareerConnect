import { httpClient } from "../httpClient/httpClient";

export const getPagedJobs = (request) => {
    const queryParams = new URLSearchParams(request);
    return httpClient.get(`/jobs?${queryParams}`);
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