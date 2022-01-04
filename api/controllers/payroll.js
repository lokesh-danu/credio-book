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


const payrollController = {

    setUpPayroll(req, res) { },
    addNewTeam(req, res) { },
    editBusinessInfo(req, res) { },
    getBusinessInfo(req, res) { },
    editPayPeriod(req, res) { },
    getPayPeriod(req, res) { },
    getbankAccount(req, res) { },
    editBankAccount(req, res) { },
    editBankAccount(req, res) { },

};

module.exports = payrollController;

