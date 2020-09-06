const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when clients connects
io.on("connection", (socket) => {
  console.log(`New connection found: ${socket.id}`);
  //Receiving event
  socket.on("comment", (data) => {
    console.log(data);
    data.time = Date();
    // Sending or emiting the event from server to many other browser
    socket.broadcast.emit("comment", data);
  });

  // receiving the typing event from browser app.js
  socket.on("typing",(data)=>{
      console.log(data);
      // sendimg or emiting the event (typing) from server to many other browsers
      socket.broadcast.emit("typing",data);
  });
});

//Port running

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
