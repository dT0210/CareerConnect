import { HubConnectionBuilder } from "@microsoft/signalr";
export const signalrConnection = new HubConnectionBuilder()
                                    .withUrl("/notificationsHub")
                                    .build();