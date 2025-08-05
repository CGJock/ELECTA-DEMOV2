import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Cliente conectado con ID:", socket.id);

  // Emitimos un mensaje de prueba
  socket.emit("send-test", "¡Hola desde el cliente de prueba!");
});

// Escuchamos el mensaje que viene del servidor
socket.on("receive-test", (msg) => {
  console.log("Mensaje recibido desde el servidor:", msg);
});