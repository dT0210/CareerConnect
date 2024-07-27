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

export const editCompany = (id, body) => {
  return httpClient.put(`/companies/${id}`, body);
}

export const getCompanyProfile = (companyId) => {
  return httpClient.get(`/companies/${companyId}`);
}

export const getRecruiter = (id) => {
  return httpClient.get(`/recruiters/${id}`);
}
