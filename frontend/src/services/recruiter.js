import { httpClient } from "../httpClient/httpClient";

export const recruiterLogin = (body) => {
  return httpClient.post("/auth/login/recruiter", body);
};

export const recruiterRegister = (body) => {
  return httpClient.post("/recruiters/register", body);
};

export const getRecruiter = (id) => {
  return httpClient.get(`/recruiters/${id}`);
};