// const userChecker = require('../middlewares/user_auth');
const storeSchema = require('../schemas/stores').user;
var axios = require("axios").default;
require('dotenv').config()
const http = require("https");
var NodeRSA = require('node-rsa');
var request = require('request');
const decryptor = require('../middlewares/cryto');
var bcrypt = require('bcryptjs');
const middleware = require('../middlewares/auth');
const storeController = {

    getStores(req, res) {

        storeSchema.find({ "wallet.phoneNumber": req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                return res.json({ status: 200, message: doc });
            }

        });

    },

    getVaultDetails(req, res) {
        storeSchema.find({ phoneNumber: req.decoded.phoneNumber }, function (err, doc) {
            if (err) {
                res.status(400);
                return res.json({ "message": err, "status": 400 });
            } else {
                res.status(200);
                return res.json({ status: 200, message: doc });
            }

        });
    },

    createNewStore(req, res) {

        const body = req.body;
        try {
            var store = {
                name: body.name,
                phoneNumber: req.decoded.phoneNumber,
                iconType: body.iconType,
                wallet: {
                    phoneNumber: req.decoded.phoneNumber,
                    walletName: body.name,
                    balance: 0
                }
                // might have to add a config array for ws connections
            };

            var result = storeSchema(store);
            if (result.save()) {
                res.status(200);
                return res.json({ status: 200, message: "New Store succeffully created." })
            }
            else {
                res.status(400);
                return res.json({ status: 400, message: "We currently can not process registration", });
            }



        } catch (e) {
            res.status(500);
            return res.json({ status: 400, message: "We currently can not process registration", error: e });
        }
    },


    payToStore(req, res) {
        try {
            // pay to store.
        } catch (e) {
            res.status(500);
            return res.json({})
        }
    },


    notifications(req, res) {
        var query = storeSchema.findOne({ phoneNumber: req.decoded.phoneNumber }).select("notifications -_id");

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

    withdrawFromWallet(req, res) {

    },
    walletToPrimaryWallet(req, res) {

    },

    walletToDomicilary(req, res) {

    }
};

module.exports = storeController;

