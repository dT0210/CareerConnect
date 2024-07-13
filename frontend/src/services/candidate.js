import { httpClient } from "../httpClient/httpClient";

export const candidateLogin = (body) => {
  return httpClient.post("/auth/login/candidate", body);
};

export const candidateRegister = (body) => {
  return httpClient.post("/candidates/register", body);
};
