import { httpFormDataClient } from "../httpClient/httpClient";

export const uploadImage = (file) => {
    const uploadData = new FormData();
    uploadData.append("File", file);
    uploadData.append("FileName", file.name);
    return httpFormDataClient.post("/files/images/upload", uploadData);
}

export const uploadPdf = (candidateId, file) => {
    const uploadData = new FormData();
    uploadData.append("File", file);
    uploadData.append("FileName", file.name);
    uploadData.append("CandidateId", candidateId);
    return httpFormDataClient.post("/files/pdfs/upload", uploadData);
}