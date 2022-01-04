const decrypt = require('./middlewares/cryto');
const http = require('http');
const express = require('express');
const app = express();
var cors = require('cors')
const db = require('./database/index');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const vgs = require('./middlewares/vgs')

const server = http.createServer(app);
const socket = require("socket.io")
const credioMerchantRoute = require('./routes/credio_merchant_route');
const payRoute = require('./routes/pay_route');
const savingRoute = require('./routes/savings');
const credioRoute = require('./routes/credio_route');
const payrollRoute = require('./routes/payroll');
const authRoute = require('./routes/auth_route');


const chatRoute = require('./controllers/chat_controller');
const errors = require('./const/errors');
const chatController = require('./controllers/chat_controller');

require('dotenv').config();

db.onConnect(() => {

  console.log("database connected");

});

// set mongoose
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))


app.get("/", (req, res) => {

  res.json({ status: 200, message: "Welcome to crediometer api. " });
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', credioRoute);
app.use('/api/v1/agent', credioMerchantRoute);
app.use('/api/v1/payroll', payrollRoute);
app.use('/api/v1/pay', payRoute);
app.use('/api/v1/credio_store', savingRoute);

// Set static folder

// app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  // console.log(err);
  const status = err.status || 500;
  const message = err.message || errors.SERVER_ERR;
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

const io = socket(server);



io.of("/chat").on("connection", (socket) => {

  chatController.changeSocketId(socket, true);

  socket.on("isTyping", msg => {

    chatController.isTyping(msg, io);
  });

  socket.on("stopTyping", msg => {
    chatController.stopTyping(msg, io);
  });

  socket.on("sendMessage", msg => {

    chatController.sendMessage(msg, socket, io);
  });

  socket.on("getChat", msg => {
    chatController.getAllMyMessages(msg, socket);
  })

  socket.on("getPeople", msg => {
    chatController.getEveryone(msg, socket);
  });


  socket.on("getAllChat", msg => { });

  socket.on("disconnect", msg => {

    chatController.changeSocketId(socket, false);
    io.emit("offline", { message: socket.handshake.query });
  });
  socket.on("sendOneToOneMessage", msg => { });
  socket.on("updateRead", msg => { });
  socket.on("getGroups", msg => { });
  socket.on("getGroupChats", msg => { });
  socket.on("updateGroupChat", msg => { });

});



io.of("/groupChat").on("connection", (socket) => {



  socket.on("typing", msg => {

    socket.emit("isTyping", msg);
  });

  socket.on("stopTyping", msg => {

    socket.emit("isTyping", msg);
  });

  socket.on("sendMessage", msg => {
    socket.emit('newMessage', msg);
  });


  socket.on("getAllGroupChats", msg => {
    chatController.getGroupMessages();
  });
  socket.on("reconnect", msg => {
    chatRoute.joinGroups(req, socket);
  });


  socket.on("disconnect", msg => { });
  socket.on("updateRead", msg => { });
  socket.on("getGroups", msg => { });
  socket.on("getGroupChats", msg => { });
  socket.on("updateGroupChat", msg => { });
});

// io.on('connection', socket => {


//   socket.on('addHistory', msg => {
//     // const user = getCurrentUser(socket.id);

//     console.log("data.... ", msg)

//     let historyData = {
//       sicknessName: msg.name,
//       diagnoses: msg.diagonsis,
//       illnesstype: msg.type,
//       userHash: msg.hash,
//       doctorHash: msg.doctorHash,
//       medication: msg.medication
//     };

//     bc.addnewAsset(historyData, 1);
//     var res = bc.addnewBlock(1, socket);
//     console.log("result ---- ", res);


//     // io.to(user.room).emit('message', msg);
//   });

//   socket.on('getHistories', msg => {
//     // console.log("Are you getting here.....");
//     // var data =  JSON.parse(msg)
//     console.log("data.... ", msg.hash)

//     var res = bc.getBlock(msg.hash, 1, socket);

//     console.log("res. ", res);


//     // socket.
//     //     // to(socketId).
//     //     emit('historyResult', res);

//   });

//   socket.on('disconnect', () => {
//     console.log("socket removed");
//     // remove id from socket.

//     // userCtl.updateStatusDisconnect({
//     //     wid: socket.id, jwt: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNDNjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5NDIzODI5MDU0OTQtNjMxN2hwdWxwdDk1ODg2Mmhocm1jcTA2M2gwNGw1bmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NDIzODI5MDU0OTQtNjMxN2hwdWxwdDk1ODg2Mmhocm1jcTA2M2gwNGw1bmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQwMDczOTcwNzE2NzgwNjMwOTkiLCJlbWFpbCI6ImJhc2UzNi5yckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Il9TSTVkRjZHV2NlSXc0eXEwZnV6YlEiLCJub25jZSI6IlJncTc3VmRncUJYd281bUg5ODVxUVBxMVJjLWFQS3NqTFpBOVk3RXhnNlUiLCJuYW1lIjoiUmFqaSBSYXNoZWVkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpU0p0aWZfbWo1XzBCUEF6T2xiMmJzT1JYLVNrakF4d3RFLUZ0aWVnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJhamkiLCJmYW1pbHlfbmFtZSI6IlJhc2hlZWQiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTYxNzQ0OTc5MCwiZXhwIjoxNjE3NDUzMzkwfQ.a2KH8l9F6zLbDcloLO7egZCVYIgWL53rotAO8mZKo9CvfA4_alyHsL_cHaNuXEZcX_nYyrDqQeG-eXGWk9W6FXQu_5kD2I3DtunCtOOtL1hacm847fC7jsTmMC4O5SxCYo_sZCnGxB1ye-dbdtMmaCt56vefFOcoHkabTmEv-11ajTc-Sk_STPie-pNBt1m8WXcniOBms3uF_q-8rGBo5ts_op1S1VWZ-vs6a9tpIoS8HPvbA862uFHkMNOry0dbsJf5vClWCFTPlolP37MbC18OSGcAMH0VQrcYCP-Vi9jP5qI8xMSpUKgdZ_k5yj_rXCaXIqRLpyd8jiWVtejxTw"
//     // }, () => {

//     //     console.log("svdv");
//     //     const user = userLeave(socket.id);


//     //     if (user) {
//     //         // io.to(user.room).emit(
//     //         //     'message',
//     //         //     formatMessage(botName, `${user.username} has left the chat`)
//     //         // );

//     //         // Send users and room info
//     //         // io.to(user.room).emit('roomUsers', {
//     //         //     room: user.room,
//     //         //     users: getRoomUsers(user.room)
//     //         // });
//     //     }
//     // });

//   });


// 
// });
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));