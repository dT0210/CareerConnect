import { httpClient } from "../httpClient/httpClient";

export const recruiterLogin = (body) => {
  return httpClient.post("/auth/login/recruiter", body);
};

export const recruiterRegister = (body) => {
  return httpClient.post("/recruiters/register", body);
};

export const createCompany = (body) => {
  return httpClient.post("/companies", body);
}
