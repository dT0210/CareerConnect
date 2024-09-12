import { filterUndefinedAndNull } from "../common/helpers";
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

export const createSkill = (body) => {
    return httpClient.post("/skills", body);
}

export const deleteSkill = (id) => {
    return httpClient.delete(`/skills/${id}`);
}

export const createField = (body) => {
    return httpClient.post("/fields", body);
}

export const deleteField = (id) => {
    return httpClient.delete(`/fields/${id}`);
}

export const getReports = (request) => {
    const params = new URLSearchParams(filterUndefinedAndNull(request));
    return httpClient.get(`/reports?${params}`)
}

export const getReportById = (id) => {
    return httpClient.get(`/reports/${id}`);
}

export const updateReportStatus = (id, status) => {
    return httpClient.put(`/reports/${id}/status?status=${status}`);
}