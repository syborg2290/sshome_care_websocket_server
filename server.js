require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

const socketio = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketio(server);
const connectionDb = require("./database");

// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getItems(socket), 1000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     connectionDb.end();
//     clearInterval(interval);
//   });
// });

// const getItems = (socket) => {
//   var sql = "SELECT * FROM item";
//   connectionDb.query(sql, function (err, results) {
//     if (err) {
//       throw err;
//     }
//     socket.emit("fetchItems", results);
//   });
// };

io.on("connection", function (socket) {
  socket.on("fetchItems", () => {
    var sql = "SELECT * FROM item";
    connectionDb.query(sql, function (err, results) {
      if (err) {
        throw err;
      }
      io.emit("messageFromServer", results);
    });
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("Server running on port 4000");
});
