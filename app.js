const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const env = require("dotenv").config();

console.log(process.env.PORT);

app.use(cors());

app.get("/hello", (req, res) => {
  res.send("hello from the other siiiiiiide");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  console.log("socket.id", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(process.env.PORT || 8080, () =>
  console.log(`Server is running on port ${process.env.PORT || 8080}`)
);
