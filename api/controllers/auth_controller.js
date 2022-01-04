const userSchema = require('../schemas/users').user;
var axios = require("axios").default;
require('dotenv').config()
const http = require("https");
var request = require('request');
const decryptor = require('../middlewares/cryto');
var bcrypt = require('bcryptjs');
const middleware = require('../middlewares/auth');

const generateApiKey = require('generate-api-key');

const authController = {

    getUser(req, res) {

        userSchema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                return res.json({ status: 200, message: doc });
            }

        });

    },

    login(req, res) {
        console.log("request --- ", req.body);
        let pwd = decryptor.dec(req.body.password);

        userSchema.findOne({ phoneNumber: req.body.phoneNumber, }, function (err, doc) {
            console.log(doc);
            if (err) {

                return res.json({ "message": 'Couldnt find an account associated with this number', "status": 400 });
            } else if (doc == null) {

                res.status(400);
                return res.json({ "message": 'No account associated with this number', "status": 400 });
            } else {
                console.log('passowrd is ', pwd)
                bcrypt.compare(pwd, doc.password, function (error, result) {
                    // res === true
                    if (error) {
                        console.error("this is the error -", error);
                        res.status(400);
                        return res.json({ "message": error, "status": 400 });
                    }
                    if (!result) {

                        console.error(err);
                        res.status(400);
                        return res.json({ "message": "Incorrect password, please try again", "status": 400 });
                    }

                    console.log("Passed this staged....");
                    middleware.jwtGenerator(req, res, doc);

                });
            }
        });
    },
    savePassword(req, res) {
        var phoneNumber = req.body.phoneNumber;
        let password = decryptor.dec(req.body.password);





        try {
            var genSalt = bcrypt.genSaltSync(15);

            bcrypt.hash(password, genSalt, function (err, hash) {
                // Store hash in your password DB.
                console.log("got here -- ", hash);
                if (err) {
                    res.status(400);
                    return res.json({ status: 400, message: "We currently can not process registration", error: err });
                }
                var user = new userSchema({
                    password: hash,
                    phoneNumber

                });
                // save model to database
                user.save(function (error, book) {
                    if (error) { console.log("What's wrong? -- ", error); res.status(400); return res.json({ status: 400, message: "We currently can not process registration", error: error }); }
                    console.log(book._id);
                    const live_api = generateApiKey({
                        method: 'string',
                        name: phoneNumber,
                        prefix: "live-key",
                        dashes: false,
                        namespace: book._id.toString(),
                        dashes: false
                    });

                    const sandbox_api = generateApiKey({
                        method: 'string',
                        name: phoneNumber,
                        dashes: false,
                        prefix: "sandbox-key",
                        namespace: book._id.toString(),
                        dashes: false
                    });

                    var data = {
                        sandBoxKey: sandbox_api,
                        apiKey: live_api
                    }

                    userSchema.findOneAndUpdate({ _id: book._id, phoneNumber }, { $set: data }, { new: true }, (rough, doc) => {
                        if (rough) {
                            res.status(400);
                            return res.json({ status: 400, message: "We currently can not process registration", error: rough });
                        }
                        return middleware.jwtGenerator(req, res, book);
                    });


                });



            });
        } catch (e) {
            res.status(500);
            return res.json({ status: 500, message: "We currently can not process registration", error: err });
        }


        // userSchema.
    },
    addUser(req, res,) {
        const body = req.body;
        try {
            var user = {
                name: body.name,
                nameLower: body.name.toLowerCase(),
                businessAddress: body.businessAddress,
                businessName: body.businessName,
                // might have to add a config array for ws connections
            };

            // save model to database


            console.log("waitin dea occur ", user)

            console.log("here at all", req.decoded);
            var data = {
                "to": req.decoded.phoneNumber,
                "from": process.env.TERMII_FROM,
                "sms": `Hi ${body.name}, welcome to Crediometer.\nYour vault number is ${req.decoded.phoneNumber.replace(/\D/g, '').slice(-10)}. Thank you!`,
                "type": "plain",
                "channel": process.env.TERMII_CHANNEL,
                "api_key": process.env.TERMII_API,

            };
            var options = {
                'method': 'POST',
                'url': 'https://termii.com/api/sms/otp/send',
                'headers': {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)

            };
            request(options, function (error, response) {
                if (error) {
                    console.log("error sending otp: ", error);
                    res.status(400);
                    return res.json({ status: 400, message: "an error occured while sending otp" });
                }
                userSchema.findOneAndUpdate({ phoneNumber: req.decoded.phoneNumber }, { $set: user }, null, function (err, book) {
                    if (err) { res.status(400); return res.json({ status: 400, message: "We currently can not process registration", error: err }); }
                    res.status(200);
                    return res.json({ status: 200, message: "Account succeffully created." })
                });
            });

        } catch (e) {
            console.log("error ");
            res.status(500);
            return res.json({ status: 500, message: "We currently can not process registration", error: e });
        }
    },

    // perfected.

    sendAuthOtp(req, res,) {
        user.findOne({ email: req.body.phoneNumber }, function (err, user) {

            if (err || !user) {
                var data = {
                    "api_key": process.env.TERMII_API,
                    "message_type": "ALPHANUMERIC",
                    "to": req.body.phoneNumber,
                    "from": process.env.TERMII_FROM,
                    "channel": process.env.TERMII_CHANNEL,
                    "pin_attempts": 10,
                    "pin_time_to_live": 5,
                    "pin_length": 6,
                    "pin_placeholder": "< 232483 >",
                    "message_text": "Welcome to Credio Merchant family, to proceed use this confirmation code < 232483 >. Token expires in 5 minutes.",
                    "pin_type": "NUMERIC"
                };
                var options = {
                    'method': 'POST',
                    'url': 'https://termii.com/api/sms/otp/send',
                    'headers': {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)

                };
                request(options, function (error, response) {
                    if (error) {
                        console.log("error sending otp: ", error);
                        res.status(400);
                        return res.json({ status: 400, message: "an error occured while sending otp" });
                    }
                    console.log(response.body);
                    res.status(response.statusCode);
                    return res.json(JSON.parse(response.body));
                });
            } else {
                res.status(400);
                return res.json({ status: 400, message: "user already exists" });
            }
        });
    },

    getBusinessName(req, res) { },
    verifyAuthOtp(req, res,) {

        var data = {
            "api_key": process.env.TERMII_API,
            "pin_id": req.body.pin_id,
            "pin": req.body.pin
        };
        var options = {
            'method': 'POST',
            'url': 'https://termii.com/api/sms/otp/verify',
            'headers': {
                'Content-Type': ['application/json', 'application/json']
            },
            body: JSON.stringify(data)

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error form verification", error);
                res.status(400);
                return res.json({ status: 400, message: "an error occured while verifying otp" });
            }
            console.log(response.body);
            res.status(response.statusCode);
            return res.json(JSON.parse(response.body));
        });
    },

    updateStatus({ wid, jwt }, next,) {
        userSchema.findOneAndUpdate({ auth: "" + jwt }, { $set: { wsId: wid, status: true, lastSeen: Date.now() } }, { new: true }, function (err, doc) {
            if (e) {
                console.log("Something wrong when updating data! --- " + e);

                res.status(200);
            } else {
                next;
            }

        });
    },

    updateStatusDisconnect({ wid, jwt }, next) {
        userSchema.findOneAndUpdate({ auth: "" + jwt }, { $set: { wsId: wid, status: false, lastSeen: Date.now() } }, { new: true }, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data! --- " + err);
            } else {

                console.log("got here...");
                next();
            }

        });
    },
    searchUsers(req, next) { },

    createNewStore(req, res) { },
    addToStore(req, res) { },

    getStoreHistories(req, res) { },


    notifications(req, res) {
        var query = userSchema.findOne({ phoneNumber: req.decoded.phoneNumber }).select("notifications -_id");

        query.exec(function (err, doc) {
            if (err) {
                res.status(400);
                res.json({ status: 400, message: err })
            } else {
                res.status(200);
                res.json(doc)
            }

        });
    },

    changeAppPin(req, res) {
        const body = req.body;
        try {
            var user = {
                name: body.name,
                nameLower: body.name.toLowerCase(),
                businessAddress: body.businessAddress,
                businessName: body.businessName,
                // might have to add a config array for ws connections
            };

            // save model to database


            console.log("waitin dea occur ", user)

            console.log("here at all", req.decoded);
            userSchema.findOneAndUpdate({ phoneNumber: req.decoded.phoneNumber }, { $set: user }, null, function (err, book) {
                if (err) { res.status(400); return res.json({ status: 400, message: "We currently can not process registration", error: err }); }
                res.status(200);
                return res.json({ status: 200, message: "Account succeffully created." })
            });

        } catch (e) {
            res.status(500);
            return res.json({ status: 500, message: "We currently can not process registration", error: e });
        }
    },



    createTransactionPin(req, res) {
        let pin = decryptor.dec(req.body.pin);
        console.log("hmmmmm", pin);
        try {
            var genSalt = bcrypt.genSaltSync(15);
            bcrypt.hash(pin, genSalt, function (err, hash) {
                // Store hash in your password DB.
                console.log("got here -- ", hash);
                if (err) {
                    console.log(err)
                    res.status(500);
                    return res.json({ status: 500, message: "We currently can not process registration", error: err });
                }

                var user = {
                    pinCode: hash,
                };


                console.log("here at all", req.decoded);
                userSchema.findOneAndUpdate({ phoneNumber: req.decoded.phoneNumber }, { $set: user }, null, function (errors, result) {
                    if (errors) {
                        console.log("errors -- ", errors);
                        res.status(500);
                        return res.json({ status: 500, message: "We currently can not process pin creation", error: errors });
                    }
                    res.status(200);
                    return res.json({ status: 200, message: "Transaction Pin succeffully created." })
                });
            });

        } catch (e) {
            console.log("errors -- ", e);
            res.status(500);
            return res.json({ status: 500, message: "We currently can not process pin creation", error: e });
        }
    },

};

module.exports = authController;

