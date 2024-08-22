import { filterUndefinedAndNull } from "../common/helpers";
import { httpClient } from "../httpClient/httpClient";

export const getNotifications = (userId, limit) => {
    const params = new URLSearchParams(filterUndefinedAndNull({limit}));
    return httpClient.get(`/notifications/${userId}${params.size !== 0 ? `?${params}`: ""}`);
}

export const readNotification = (notificationId) => {
    return httpClient.put(`/notifications/${notificationId}/read`);
}