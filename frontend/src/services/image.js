import { httpFormDataClient } from "../httpClient/httpClient";

export const uploadImage = (file) => {
    const uploadData = new FormData();
    uploadData.append("File", file);
    uploadData.append("FileName", file.name);
    return httpFormDataClient.post("/images/upload", uploadData);
}