// const userChecker = require('../middlewares/user_auth');
const userSchema = require('../schemas/users').user;
const savingSchema = require('../schemas/savings').savingSchema;
const wallet = require('../schemas/wallet').model;
var axios = require("axios").default;
require('dotenv').config()
const mongoose = require('mongoose');
const http = require("https");
var NodeRSA = require('node-rsa');
var request = require('request');
const decryptor = require('../middlewares/cryto');
var bcrypt = require('bcryptjs');
const middleware = require('../middlewares/auth');

const walletShema = mongoose.model('wallets', wallet);

const userController = {

    getUserProfile(req, res) {

        /// refrence of total amount from savings to this

        userSchema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (err, user) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                savingSchema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
                    if (err) {
                        res.status(400);
                        return res.json({ "message": err, "status": 400 });
                    } else {
                        res.status(200);
                       
                        var phoneNumber = req.decoded.phoneNumber.replace(/\D/g, '').slice(-10);
                        return res.json({ status: 200, message: { phoneNumber, savings: doc } });
                    }

                });
            }

        });

    },

    getDomicilaryAccount(req, res) {
        console.log(req.body.password);
        let pwd = decryptor.dec(req.body.password);
        console.log("password --- ", pwd);

        userSchema.findOne({ phoneNumber: req.body.phoneNumber, }, function (err, doc) {
            console.log(doc);
            if (err) {
            } else if (doc == null) {

                res.status(400);
                return res.json({ "message": 'No account associated with this number', "status": 400 });
            } else {

                bcrypt.compare(pwd, doc.password, function (error, result) {
                    // res === true
                    if (error) {
                        console.error(error);
                        res.status(400);
                        return res.json({ "message": error, "status": 400 });
                    }
                    if (!result) {

                        console.error(err);
                        res.status(400);
                        return res.json({ "message": "Incorrect password, please try again", "status": 400 });
                    }
                    middleware.jwtGenerator(req, res, doc);

                });
            }
        });
    },
    primaryCard(req, res) {
        var phoneNumber = req.body.phoneNumber;

        console.log(req.body.password);
        let password = decryptor.dec(req.body.password);
        console.log("password --- ", password);
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

                    return middleware.jwtGenerator(req, res, book);
                });



            });
        } catch (e) {
            res.status(500);
            return res.json({ status: 400, message: "We currently can not process registration", error: err });
        }


        // userSchema.
    },
    histories(req, res,) {
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

    // perfected.

    getRecentTransactions(req, res,) {
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

    },

    cardToAccount(req, res) { },
    scanToAccount(req, res,) {

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

    cardToCard(req, res) {
        // card to card
        userSchema.findOneAndUpdate({}, { $set: { wsId: wid, status: true, lastSeen: Date.now() } }, { new: true }, function (err, doc) {
            if (e) {
                res.status(400);
                return res.json({ status: 400, message: "Could find user", error: e })
            } else {
                next;
            }

        });
    },

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



    // wallet

    getPimaryWallet(req, res) {
        walletShema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {

                res.status(400);
                return res.json({ status: 400, message: "Could find user", error: err })
            } else {

                res.status(200);
                return res.json({ status: 200, message: doc });

            }
        });
    },


    // set upmost
    setUpmostToWallet(req, res) {

    },


    // save to wallet

    saveToWallet(req, res) {

    },

    // withdrawFromWallet
    withdrawFromWallet(req, res) {

    },

    // wallet To wallet Transfer
    walletToWallet(req, response) {
        walletShema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {

                response.status(400);
                return response.json({ status: 400, message: "Could find user", error: err })
            } else {
                // now do stage 2 and 3
                // check if balance can allow transaction, also fund the other account then reduce it from the origin's account

                response.status(200);
                return response.json({ status: 200, message: doc });

            }
        });
    },

    walletToDomicilary(request, response) {

    },


    // Credit

    getCreditScore(req, response) {
        walletShema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (error, user) {

            if (error) return response.status(400).json({ error, message: "Error getting user", status: 400 });
            return response.status(200).json({ maxCredit: 900000, point: 745, maxSave: 50000, rating: 4, outstanding: false, });
        });

    },

    // request 

    requestForLoan(req, response) {
        walletShema.findOne({ phoneNumber: req.decoded.phoneNumber }, function (error, user) {

            if (error) return response.status(400).json({ error, message: "Error getting user", status: 400 });
            return response.status(200).json({ success: true, amount: 50000, outstanding: true, });
        });
    }
};

module.exports = userController;

