// const userChecker = require('../middlewares/user_auth');
const userSchema = require('../schemas/savings/user').user;
const transactionSchema = require('../schemas/savings/transactions').user;
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

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
const savingsController = {

    overview(req, res) {

    },
    invoice(req, res) {
        userSchema.findOne({ creator: req.decoded.phoneNumber, phoneNumber: req.body.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {

                transactionSchema.find({
                    $or: [
                        { from: doc.phoneNumber },
                        { to: doc.phoneNumber },
                    ],
                }, function (err, trans) {
                    if (err) {
                        res.status(400);
                        return res.json({ "message": err, "status": 400 });
                    } else {
                        recent = [];
                        history = [];
                        trans.forEach(element => {
                            if (isToday(element.createAt)) {
                                recent.push(element);
                            } else {
                                history.push(element)
                            }
                        });
                        return res.json({
                            status: 200, message: "DATA_GOTTEN", data: {
                                users: doc,
                                recent: recent,
                                history: history
                            }
                        });
                    }



                });

            }

        });
    },
    currentUser(req, res) {
        userSchema.find({ creator: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                return res.json({
                    status: 200, message: "USER_GOTTEN", data: doc
                });
            }

        });

    },
    createUser(req, res) {

        const body = req.body;

        try {

            // Store hash in your password DB.
            console.log("got here -- ", hash);
            if (err) {
                res.status(400);
                return res.json({ status: 400, message: "We currently can not process registration", error: err });
            }
            businessNameLower = body.businessName.toLowerCase();
            var user = new userSchema({
                businessType: body.businessType,
                creator: req.decoded.phoneNumber,
                businessNameLower: businessNameLower,
                businessAddress: body.businessAddress,
                businessName: body.businessName,
                phoneNumber: body.phoneNumber,
                accountNumber: String,
                bankDetails: {
                    accountName: body.bankDetails.accountName,
                    accountNumber: body.bankDetails.accountNumber,
                    branch: body.bankDetails.branch,
                    ifsc: body.bankDetails.ifsc
                }

            });
            // save model to database
            user.save(function (error, book) {
                if (error) {
                    res.status(400);
                    return res.json({ status: 400, message: "We currently can not process registration", error: error });
                }

                return res.status(200).json({ status: 200, message: "User has been successfully added..", data: book });
            });


        } catch (e) {
            res.status(500);
            return res.json({ status: 500, message: "We currently can not process registration", error: err });
        }

    },
    getTransactions(req, res) {
        userSchema.find({ creator: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                var result = [];
                doc.forEach(async function (user) {

                    await transactionSchema.find({
                        $or: [
                            { from: user.phoneNumber },
                            { to: user.phoneNumber },
                        ],
                    }, function (err, trans) {
                        if (err) {
                            res.status(400);
                            return res.json({ "message": err, "status": 400 });
                        } else {
                            result.push({ user: doc, transactions: trans });
                        }

                    });

                });
                return res.json({
                    status: 200, message: "DATA_GOTTEN", data: {
                        users: result
                    }
                });
            }

        });

    },

};

module.exports = savingsController;

