import { httpClient } from "../httpClient/httpClient";

export const adminLogin = (request) => {
    return httpClient.post("/auth/login/admin", request);
}

export const getPagedCompanyProfiles = (request) => {
    const queryParams = new URLSearchParams(request);
    return httpClient.get(`/companies?${queryParams}`);
}

export const approveCompanyProfile = (request) => {
    return httpClient.patch(`/companies/approve/${request.companyId}?adminId=${request.adminId}`);
}

export const rejectCompanyProfile = (request) => {
    return httpClient.patch(`/companies/reject/${request.companyId}?adminId=${request.adminId}`);
}