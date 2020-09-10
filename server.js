const express = require("express");
const fs = require('fs');
const app = express();
const https = require('https');
var options = {
      ca: fs.readFileSync('/home/ec2-user/ca_bundle.crt'),
      cert: fs.readFileSync('/home/ec2-user/certificate.crt'),
      key: fs.readFileSync('/home/ec2-user/private.key')
    };
/*const httpsServer = server.createServer({
    key: fs.readFileSync('/home/ec2-user/private.key'),
    cert: fs.readFileSync('/home/ec2-user/certificate.crt')
   // ca: fs.readFileSync('/home/ec2-user/ca_bundle.crt')
}, app);*/
var server = https.createServer(options, app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create-room/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("peer-joined", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("peer-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("peer-left", userId);
    });
  });
});

//const PORT = process.env.PORT || 8000;
/*const httpsServer = server.createServer({
    key: fs.readFileSync('/home/ec2-user/private.key','utf8'),
    cert: fs.readFileSync('/home/ec2-user/certificate.crt','utf8')
//    ca: fs.readFileSync('/home/ec2-user/ca_bundle.crt','utf8')
   // passphrase: 'YOUR PASSPHRASE HERE'
}, app);*/
//var server = https.createServer(options, app);
server.listen(8000,function(){
    });

