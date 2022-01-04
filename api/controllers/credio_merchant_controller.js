// const userChecker = require('../middlewares/user_auth');
const userSchema = require('../schemas/users').user;
const nibssSchema = require('../schemas/nibss').nibssSchema;
const notificationSchema = require('../schemas/notifications').notificationSchema;
var axios = require("axios").default;
require('dotenv').config()
const http = require("https");
var NodeRSA = require('node-rsa');
var request = require('request');
const decryptor = require('../middlewares/cryto');
const middleware = require('../middlewares/auth');
var bcrypt = require('bcryptjs');
const generateApiKey = require('generate-api-key');


const finishAccount = (req, res) => {

    const body = req.body.data;
    var phoneNumber = body.phoneNumber;
    let password = decryptor.dec(body.password);





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
                phoneNumber,
                name: body.name,
                nameLower: body.name.toLowerCase(),
                businessAddress: body.businessAddress,
                businessName: body.businessName,
            });

            // save model to database


            console.log("waitin dea occur ", user)


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
                        return res.status(200).json({ status: 200, message: doc });
                    });
                });


            });



        });

    } catch (e) {
        console.log("error ");
        res.status(500);
        return res.json({ status: 500, message: "We currently can not process registration", error: e });
    }

};

const storeController = {

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


    getStores(req, res) {

        userSchema.find({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                return res.json({ status: 200, message: doc });
            }

        });

    },



    getBusinessName(req, res) {
        var phoneNumber = `+234${req.query.phoneNumber}`;
        console.log(phoneNumber);
        userSchema.findOne({ phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                console.log({ status: 200, message: doc });
                return res.json({ status: 200, message: doc });
            }

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
        var query = notificationSchema.findOne({ phoneNumber: req.decoded.phoneNumber }).select("notifications -_id");

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
            return res.json({ status: 400, message: "We currently can not process registration", error: e });
        }
    },
    // for self-induced savings (3.3%)

    savingsCredio(req, res) {
        // api to save money.

        console.log(`request here and there \n${JSON.stringify(req.body)}`);


        var phoneNumber = `+234${req.body.vaultNumber}`;
        var amount = parseFloat(req.body.amount);

        var totalFee = (amount * 3.3);
        var amountForUser = (amount - totalFee);
        var amountForMerchant = (totalFee * 0.2);
        console.log(`${amount} -- ${totalFee} -- ${amountForUser} -- ${amountForMerchant}`);
        userSchema.updateOne(
            { phoneNumber },
            { $inc: { amount: amountForUser, } }, function (err, saved) {
                if (err) {
                    // return status 400
                    console.log("an error occured....");
                    // incase an error occured here, revert the operation.
                    return res.status(400).json({ status: 400, message: "Couldn't deposit amount", err });

                }
                userSchema.updateOne(
                    { phoneNumber },
                    { $inc: { amount: amountForUser, } }, function (err, saved) {
                        if (err) {
                            // return status 400
                            return res.status(400).json({ status: 400, message: "Couldn't deposit amount", err });
                        }
                        userSchema.updateOne(
                            { phoneNumber: req.decoded.phoneNumber },
                            { $inc: { amount: amountForMerchant, } }, function (err, merchant) {
                                var notification = new notificationSchema({
                                    receiver: req.body.businessName,
                                    phoneNumber: phoneNumber,
                                    fees: totalFee,
                                    from: req.decoded.phoneNumber,
                                    to: phoneNumber,
                                    referenceNumber: `${req.decoded.phoneNumber}-${Date.now()}`,
                                    status: 'APPROVED',
                                    description: req.decoded.comment,
                                    receiverAccountNumber: req.body.vaultNumber,
                                    receiverBankName: "Crediometer",
                                    receiverPicture: saved.profileImg,
                                    transactionType: 'DEPOSIT',
                                    amount: amount,
                                });


                                // save model to database
                                notification.save(function (error, book) {
                                    if (error) {
                                        console.log("What's wrong? -- ", error);
                                        res.status(400);
                                        return res.json({ status: 400, message: "We currently can not process registration", error: error });
                                    }

                                    return res.status(200).json({ status: 200, message: book });
                                });
                            });

                    });

            });

    },

    savingsCard(request, response) {
        // api to save money.
        const options = {
            "method": "POST",
            "hostname": "travel-advisor.p.rapidapi.com",
            "port": null,
            "path": "/locations/v2/search?currency=USD&units=km&lang=en_US",
            "headers": {
                "content-type": "application/json",
                "x-rapidapi-key": "2e5e2ad30bmsh74e1a282ac13e74p1d283djsn447ca32a09ed",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
                "useQueryString": true
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
                var query = userSchema.findOneAndUpdate({ auth: "" + jwt }).select("notifications -_id");

                query.exec(function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data! --- " + err);
                        response.json({ status: 400, message: err })
                    } else {
                        response.status(200)
                        response.json({ status: 200, message: doc });
                        // response.json( {
                        //     status: 200,
                        //     message: body.toString()
                        // });

                    }

                });
            });
        });

        // req.write(JSON.stringify({ query: 'chiang mai', updateToken: '' }));
        req.end();
    },
    savingsOtherBank(request, response) {
        // api to save money.

        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://gateway.ubaopenbanking.com/api/fundtransfer/v1.0',
            'headers': {
                'Content-Type': 'application/json',
                'AccessCode': 'Bearer 422e10e7-0f52-3b71-9899-47485ebbc9c2',
                'Applcode': 'QkVUOUpB',
                'Clientno': '24982',
                'Authorization': 'Basic QkVUOUpBVVNSOndhdGVyZmFsbA=='
            },
            body: JSON.stringify({
                "receiverBankCode": "999033",
                "receiverAccountName": "MADUMERE ROLAND CHIMAOBI",
                "receiverAccountNumber": "1009809540",
                "transactionAmount": "7.87",
                "referenceID": "8321007",
                "narration": "Funds credited",
                "countryCode": "NG",
                "tranType": "fundtransfer"
            })

        };
        request(options, function (error, res) {
            if (error) throw new Error(error);
            console.log(response.body);
            if (response.statusCode === 200) {

                var query = notificationSchema.findOneAndUpdate({ phoneNumber: request.decoded.phoneNumber }).select("notifications -_id");

                query.exec(function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data! --- " + err);
                        response.json({ status: 400, message: err })
                    } else {
                        response.status(200)
                        response.json({
                            status: 200,
                            message: res.body
                        });
                    }

                });

            } else {
                res.status(400).json({ status: 400, message: res.body })
            }
        });

        // req.write(JSON.stringify({ query: 'chiang mai', updateToken: '' }));
    },

    getAccountName(request, response) {
        // get params from request
        // const { accountNumber } = request.params;
        try {
            console.log("life style 2");
            const req = http.get("https://jsonplaceholder.typicode.com/todos/1", function (res) {
                const chunks = [];
                console.log("haaaa");
                res.on("data", function (chunk) {
                    console.log("life style");
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    console.log("life style 2");
                    const body = Buffer.concat(chunks);
                    console.log(body.toString());

                    response.status(200).json({ status: 200, message: { name: "Test name" } })
                    // var query = userSchema.findOne({ auth: "" + request.jwt }).select("notifications -_id");

                    // query.exec(function (err, doc) {
                    //     if (err) {
                    //         console.log("Something wrong when updating data! --- " + err);
                    //     } else {
                    //         console.log("here working awesome. ", body.toString());

                    //         next.emit("accountName", {
                    //             status: 200,
                    //             message: body.toString()
                    //         });

                    //     }

                    // });
                });
            }).on('error', error => {
                console.error("an error occured", error)
            });

            // req.write(JSON.stringify({ query: 'chiang mai', updateToken: '' }));
            req.end();
        } catch (e) {
            console.log("stop crashing server ", e);
        }
    },
    savings(req, res) {

        // credio api to remember this will be for savings

        console.log(`request here and there \n${JSON.stringify(req.body)}`);


        var phoneNumber = `+234${req.body.vaultNumber}`;
        var amount = parseFloat(req.body.amount);
        var savingCode = parseFloat(req.body.savingsCode);

        var totalFee = (amount * 3.3);
        var amountForUser = (amount - totalFee);
        var amountForMerchant = (totalFee * 0.2);
        console.log(`${amount} -- ${totalFee} -- ${amountForUser} -- ${amountForMerchant}`);
        userSchema.updateOne(
            { phoneNumber },
            { $inc: { amount: amountForUser, } }, function (err, saved) {
                if (err) {
                    // return status 400
                    console.log("an error occured....");
                    // incase an error occured here, revert the operation.
                    return res.status(400).json({ status: 400, message: "Couldn't deposit amount", err });

                }
                userSchema.updateOne(
                    { phoneNumber },
                    { $inc: { amount: amountForUser, } }, function (err, saved) {
                        if (err) {
                            // return status 400
                            return res.status(400).json({ status: 400, message: "Couldn't deposit amount", err });
                        }
                        userSchema.updateOne(
                            { phoneNumber: req.decoded.phoneNumber },
                            { $inc: { amount: amountForMerchant, } }, function (err, merchant) {
                                var notification = new notificationSchema({
                                    receiver: req.body.businessName,
                                    phoneNumber: phoneNumber,
                                    fees: totalFee,
                                    from: req.decoded.phoneNumber,
                                    to: phoneNumber,
                                    referenceNumber: `${req.decoded.phoneNumber}-${Date.now()}`,
                                    status: 'APPROVED',
                                    description: req.decoded.comment,
                                    receiverAccountNumber: req.body.vaultNumber,
                                    receiverBankName: "Crediometer",
                                    receiverPicture: saved.profileImg,
                                    transactionType: 'DEPOSIT',
                                    amount: amount,
                                });


                                // save model to database
                                notification.save(function (error, book) {
                                    if (error) {
                                        console.log("What's wrong? -- ", error);
                                        res.status(400);
                                        return res.json({ status: 400, message: "We currently can not process registration", error: error });
                                    }

                                    return res.status(200).json({ status: 200, message: book });
                                });
                            });

                    });

            });
    },
    changeProfilePicture(req, next) {

    },
    withdrawal(requests, next) {

        // make Api call here.

        const options = {
            "method": "POST",
            "hostname": "travel-advisor.p.rapidapi.com",
            "port": null,
            "path": "/locations/v2/search?currency=USD&units=km&lang=en_US",
            "headers": {
                "content-type": "application/json",
                "x-rapidapi-key": "2e5e2ad30bmsh74e1a282ac13e74p1d283djsn447ca32a09ed",
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
                "useQueryString": true
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
                var query = userSchema.findOneAndUpdate({ auth: "" + jwt }).select("notifications -_id");

                query.exec(function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data! --- " + err);
                        next.emit("getNotifications", { status: 400, message: err })
                    } else {

                        next.emit("getNotifications", { status: 200, message: doc })
                        next.emit("withdrawalResult", { status: 200, message: doc })

                    }

                });
            });
        });

        // req.write(JSON.stringify({ query: 'chiang mai', updateToken: '' }));
        req.end();

    },
    nibss(req, res) {

        nibssSchema.find({}, { test: 1, }, function (err, nibbsRes) {
            if (err) {
                res.json({ status: 400, message: err });

            } else {
                console.log("result", nibbsRes);
                var result = nibbsRes[0].test.sort(function (a, b) {
                    if (a.INSTITUTIONNAME < b.INSTITUTIONNAME) { return -1; }
                    if (a.INSTITUTIONNAME
                        > b.INSTITUTIONNAME
                    ) { return 1; }
                    return 0;
                });


                res.status(200).json({ status: 200, message: result });


            }
        });




    },

    sendOtp(req, res) {
        userSchema.findOne({ email: req.body.phoneNumber }, function (err, user) {

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
    verifyAuthOtp(req, res,) {

        var data = {
            "api_key": process.env.TERMII_API,
            "pin_id": req.body.otp.pin_id,
            "pin": req.body.otp.pin
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
            return finishAccount(req, res);
        });
    },

    payattidute(req, res) {

    },

    getNotifications(req, res){

    }

};

module.exports = storeController;

