import { httpClient } from "../httpClient/httpClient";

export const candidateLogin = (body) => {
  return httpClient.post("/auth/login/candidate", body);
};

export const candidateRegister = (body) => {
  return httpClient.post("/candidates/register", body);
};

export const getCandidateDetails = (id) => {
  return httpClient.get(`/candidates/${id}`);
}

export const getAppliedJobs = (candidateId, request) => {
  const query = new URLSearchParams(request);
  return httpClient.get(`/candidates/${candidateId}/applied-jobs?${query}`);
}