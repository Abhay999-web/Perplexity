import { io } from 'socket.io-client';

export function initializeSocketConnection() {
    
   a
    const socket = io("/", {
        withCredentials: true,
        autoConnect: true
    });

    socket.on("connect", () => {
        console.log("Connected to Socket.io server securely! ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection failed context:", err.message);
    });

    return socket; 
}