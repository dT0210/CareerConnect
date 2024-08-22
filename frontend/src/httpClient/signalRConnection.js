import { HubConnectionBuilder } from "@microsoft/signalr";

const token = localStorage.getItem("token");

export const signalrConnection = new HubConnectionBuilder()
                                    .withUrl("http://localhost:5000/notificationsHub", {
                                        accessTokenFactory: () => token, // Send the token with the connection request
                                      })
                                    .build();