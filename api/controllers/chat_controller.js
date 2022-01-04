
const chatSchema = require('../schemas/chat').chat;
const groupChatSchema = require('../schemas/group_chat').chat;
const groupSchema = require('../schemas/groups').chat;
const userSchema = require('../schemas/users').user;
// 
const chatController = {


    sendMessage(req, next, io) {
        console.log(req);
        comboUid = '';
        myUid = req.senderAuth;
        yourUid = req.recieverAuth;

        if (myUid > yourUid) {
            combboUid = myUid + '___' + yourUid;

        } else if (yourUid > myUid) {
            combboUid = yourUid + '___' + myUid;
        } else {
            combboUid = myUid + '___' + yourUid;
        }

        console.log("uids --", combboUid);

        try {
            var phoneNumber = req.phoneNumber.trim();

            console.log("messages ---- haaa ", phoneNumber);
            userSchema.findOne({ phoneNumber }, function (err, user) {


                chatSchema({ senderAuth: myUid, msg: req.msg, combo: combboUid, type: req.type, recieverAuth: yourUid }).save(function (error, book) {
                    if (error) {
                        console.log(error)
                        next.emit("onNewMessage", { sent: false, message: req, e: error, status: 401 });
                    }
                    else {
                        console.log("data --- ", book)
                        next.emit("onNewMessage", { sent: true, message: book, status: 200 });
                        if (err) return;
                        console.log(user);
                        io.of('/chat').to(user.wsId).emit("onNewMessage", { sent: true, message: book, status: 200 });

                    }
                });
            });
        } catch (e) {
            console.log("messages ---- ", e);
            next.emit("onNewMessage", { sent: false, message: req, e, status: 401 });
        }


    },

    isTyping(msg, io) {

        var phoneNumber = msg.yourPhoneNumber.trim();
        console.log("istyping  ", phoneNumber);
        userSchema.findOne({ phoneNumber }, function (err, book) {
            if (err) return;

            io.of('/chat').to(book.wsId).emit("onTyping", { phoneNumber: msg.phoneNumber });
        });
    },
    stopTyping(msg, io) {

        var phoneNumber = msg.yourPhoneNumber.trim();
        console.log(phoneNumber)
        userSchema.findOne({ phoneNumber }, function (err, book) {
            if (err) return;

            io.of('/chat').to(book.wsId).emit("onStopTyping", { phoneNumber: msg.phoneNumber });
        });
    },


    changeSocketId(socket, online = true) {
        let phoneNumber = "+" + socket.handshake.query.phoneNumber.trim();
        var ids = {
            wsId: socket.id,
            status: online,
            lastSeen: Date.now()
        };
        console.log(phoneNumber);
        console.log(ids)
        userSchema.findOneAndUpdate({ phoneNumber }, { $set: ids }, null, function (err, book) {
            if (err) return console.log(err);
            groupSchema.find({ users: { $elemMatch: phoneNumber } }, function (error, groups) {
                if (error) return console.log("errors ", err);
                var arr2 = arr1.map(v => (v._id));
                joinGroup(arr2, socket);
            });
        });
    },

    joinGroup(groups, socket) {
        if (groups.length == 0) {
            return;
        } else {
            return socket.join(book.groupChats);
        }
    },


    createGroup(req, socket) {
        try {
            var chat = groupSchema({ snederAmth: req.senderId, msg: req.content, groupId: combboUid, type: req.body.type });
            if (chat.save()) {
                next.to(req.groupId).emit("messageGroupSending", { sent: true, req: req.id, message: "Joined all groups", status: 200 });
            }
            else {
                next.emit("messageGroupSending", { sent: false, req: req.id, error: "Could not save message", status: 401 });
            }

        } catch (e) {
            next.emit("messageGroupSending", { sent: false, error: e, reqId: req.id, status: 401 });
        }
    },
    getGroups(req, socket) {
        try {
            groupSchema.find({ favouriteFoods: req.phoneNumber }, function (err, groups) {
                if (err) {
                    next.emit("onGetGroups", { sent: false, message: `An error occured $err`, status: 401 });
                }
                var result = [];
                for (group in groups) {
                    for (user in group.users) {

                        userSchema.find({ phoneNumber: { "$in": user.users } }, function (err, res) {
                            if (err) {
                                socket.emit("onGetGroups", { sent: false, message: `An error occured $err`, status: 401 });
                            }

                            result.push({ "users": res, "group": group })
                        });

                    }
                }

                console.log("peoples", result);

                socket.emit("onGetGroups", { sent: true, message: result, status: 200 });
            });


        } catch (e) {
            socket.emit("onGetGroups", { sent: false, message: `An error occured $e`, status: 401 });
        }

    },

    getEveryone(req, next) {

        try {
            userSchema.find({}, function (err, users) {
                if (err) {
                    next.emit("onPeople", { sent: false, message: `An error occured $err`, status: 401 });
                }

                console.log("peoples ", users);

                next.emit("onPeople", { sent: true, message: users, status: 200 });
            });


        } catch (e) {
            next.emit("onPeople", { sent: false, message: `An error occured $e`, status: 401 });
        }


    },

    getAllMyMessages(req, next) {
        try {
            chatSchema.find({ $or: [{ senderAuth: req.jwt }, { recieverAuth: req.jwt }] }, function (err, users) {
                if (err) {
                    next.emit("onChat", { sent: false, message: `An error occured $err`, status: 401 });
                }

                console.log("peoples ", users);

                next.emit("onChat", { sent: true, message: users, status: 200 });
            });


        } catch (e) {
            next.emit("onChat", { sent: false, message: `An error occured $e`, status: 401 });
        }
    },

    addToGroup(req, socket) {


        groupSchema.findById(req._id, function (err, group) {
            if (err) {
                next.emit("addToGroup", { error: "Service not available", status: 401 });
            } else {

                if (group.phoneNumber == req.requester) {
                    group.users.push(req.newUser);
                    if (group.save()) {
                        socket.joinRoom(e);
                        next.emit("addToGroup", { message: "", status: 200 });
                    } else { }
                } else {
                    next.emit("addToGroup", { message: "You are not allowed to add user", status: 401 });
                }

            }
        });

    },


    addNewUserTogroup(req, socket) {

        userSchema.findOne({ auth: req.jwt }, function (err, person) {
            if (err) {
                next.emit("roomJoining", { error: "Service not available", status: 401 });
            } else {

                person.groupChats.map((e) => {
                    socket.joinRoom(e);
                })

                next.emit("roomJoining", { message: "Joined all groups", status: 200 });
            }
        });

    },


    sendGroupMessgae(req, socket) {

        try {
            var chat = groupSchema({ snederAmth: req.senderId, msg: req.content, groupId: combboUid, type: req.body.type });
            if (chat.save()) {
                next.to(req.groupId).emit("messageGroupSending", { sent: true, req: req.id, message: "Joined all groups", status: 200 });
            }
            else {
                next.emit("messageGroupSending", { sent: false, req: req.id, error: "Could not save message", status: 401 });
            }

        } catch (e) {
            next.emit("messageGroupSending", { sent: false, error: e, reqId: req.id, status: 401 });
        }

    },


    getGroupMessages(req, socket) {
        // get using arrays
        try {
            userSchema.findOne({ auth: req.jwt }, function (err, person) {
                if (err) {
                    next.emit("getAllGroupMessages", { sent: false, req: req.id, error: "Could not get message", status: 401 });
                } else {
                    next.emit("getAllGroupMessages", { sent: true, req: req.id, message: chats, status: 200 });
                }
            });


        } catch (e) {
            next.emit("groupMessages", { sent: false, error: e, reqId: req.id, status: 401 });
        }
    }

};
module.exports = chatController;
