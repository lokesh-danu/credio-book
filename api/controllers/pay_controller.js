// const userChecker = require('../middlewares/user_auth');
const userSchema = require('../schemas/users').user;
var axios = require("axios").default;
require('dotenv').config()
const http = require("https");
var NodeRSA = require('node-rsa');
var request = require('request');
const decryptor = require('../middlewares/cryto');
var bcrypt = require('bcryptjs');
const middleware = require('../middlewares/auth');
const payController = {

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
            res.status(200);
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
            return res.json({ status: 400, message: "We currently can not process registration", error: e });
        }
    },
    // for self-induced savings (3.3%)

    savingsCredio(request, response) {
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

    getAccountName(request, res) {
        try {
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
                    var query = userSchema.findOne({ auth: "" + request.jwt }).select("notifications -_id");

                    query.exec(function (err, doc) {
                        if (err) {
                            console.log("Something wrong when updating data! --- " + err);
                        } else {
                            console.log("here working awesome. ", body.toString());

                            next.emit("accountName", {
                                status: 200,
                                message: body.toString()
                            });

                        }

                    });
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
    savings(request, next) {

        // credio api to deposit

        console.log("contents\n\n", request);
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
                var query = userSchema.findOneAndUpdate({ auth: "" + request.jwt }).select("notifications -_id");

                query.exec(function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data! --- " + err);
                        next.emit("getNotifications", { status: 400, message: err })
                    } else {

                        next.emit("getNotifications", { status: 200, message: doc });
                        next.emit("depositResult", {
                            status: 200,
                            message: body.toString()
                        });

                    }

                });
            });
        });

        // req.write(JSON.stringify({ query: 'chiang mai', updateToken: '' }));
        req.end();
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


    overview(req, res) {

        var users = randomInteger(450, 2000);
        var highest = randomInteger(2300, 9000);
        var total = randomInteger(40, 4000);
        var week = randomInteger(10000, 2000000);

        res.status(200);
        return res.json({ users, highest, total, week });

    },

    recent(req, res) {
        res.status(200);
        return res.json({});
    },

    customers(req, res) {
        res.status(200);
        return res.json({});
    },
    activities(req, res) {
        res.status(200);
        return res.json({});
    },

    balance(req, res) {
        var balance = randomInteger(4900, 93000);
        res.status(200);
        return res.json({
            balance: balance,
            vault: {
                number: req.decoded.phoneNumber.replace(/\D/g, '').slice(-10),
                name: "Rasheed Raji"
            },

        });
    },


    transfer(req, res) {
        var balance = randomInteger(4900, 93000);
        var total = randomInteger(5900, 10000);
        var success = randomInteger(50, 90);
        res.status(200);
        return res.json({
            balance: balance,
            transfer: {
                total: total,
                success: success
            },

        });
    },

    transactions(req, res) {
        
    }

};

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = payController;

