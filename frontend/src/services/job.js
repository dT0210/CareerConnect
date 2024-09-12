import { httpClient } from "../httpClient/httpClient";

export const getPagedJobs = (request) => {
  const queryParams = new URLSearchParams(request);
  return httpClient.get(`/jobs?${queryParams}`);
};

export const getJobById = (id) => {
  return httpClient.get(`/jobs/${id}`);
};

export const createJob = (body) => {
  return httpClient.post("/jobs", body);
};

export const editJob = (id, body) => {
  return httpClient.put(`/jobs/${id}`, body);
};

export const getSkills = (request) => {
  const params = new URLSearchParams(request);
  if (params.size > 0) return httpClient.get(`/skills?${params}`);
  return httpClient.get(`/skills`);
};

export const getFields = (request) => {
  const params = new URLSearchParams(request);
  if (params.size > 0) return httpClient.get(`/fields?${params}`);
  return httpClient.get("/fields");
};

export const applyJob = (body) => {
  return httpClient.post("/applications", body);
};

export const getApplications = (request) => {
  const params = new URLSearchParams(request);
  return httpClient.get(`/applications?${params}`);
};

export const changeApplicationStatus = (id, status) => {
  return httpClient.put(`/applications/${id}/status`, status);
};

export const reportJob = (body) => {
  return httpClient.post("/reports", body);
}

export const deleteJob = (jobId) => {
  return httpClient.delete(`/jobs/${jobId}`);
}