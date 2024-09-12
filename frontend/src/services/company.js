import { httpClient } from "../httpClient/httpClient";

export const createCompany = (body) => {
  return httpClient.post("/companies", body);
};

export const editCompany = (id, body) => {
  return httpClient.put(`/companies/${id}`, body);
};

export const getCompanyProfile = (companyId) => {
  return httpClient.get(`/companies/${companyId}`);
};

