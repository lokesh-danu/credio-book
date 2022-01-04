const express = require('express');
const router = express.Router();
const credioMerchantController = require('../controllers/credio_merchant_controller');
const storeController = require('../controllers/store_controller');

const middleware = require('../middlewares/auth');



// this endpoint is for Credio Mechants

router.get('/action/getBusinessName', middleware.verify, credioMerchantController.getBusinessName);


// router.get('/action/getBusinessName', middleware.verify, credioMerchantController.getName);

// Action routes

// endpoint for saving credio
router.post("/action/deposit/credio", middleware.verify, credioMerchantController.savingsCredio);



router.post("/action/open/account", middleware.verify, credioMerchantController.sendOtp);


router.post("/action/open/account/verify", middleware.verify, credioMerchantController.verifyAuthOtp);


// endpoint for saving card
router.post("/action/deposit/card", middleware.verify, credioMerchantController.savingsCard);

// endpoint for getting nibss of other banks
// 
router.get("/action/deposit/nibss", middleware.verify, credioMerchantController.nibss);

// get account name from nibbs
router.get("/action/deposit/nibss/name", middleware.verify, credioMerchantController.getAccountName);
// endpoint for saving other banks
router.post("/action/deposit/OtherBank", middleware.verify, credioMerchantController.savingsOtherBank);

router.post("/action/savings", middleware.verify, credioMerchantController.savings);

router.post("/action/withdrawal", middleware.verify, credioMerchantController.withdrawal);

// user profile 
router.get("/user/getProfile", middleware.verify, credioMerchantController.getUser);

router.get("/user/notifications", middleware.verify, credioMerchantController.notifications);

// app pin
router.put("/user/changeAppPin", middleware.verify, credioMerchantController.changeAppPin);



// endpoint for saving to payattidute

router.post("/stores/deposit/payattidute", middleware.verify, credioMerchantController.payattidute);


// router.get("/stores/notificationa", middleware.verify, storeController.getNotifications)



router.post('/stores/createNewStore', middleware.verify, storeController.createNewStore);


router.get('/stores/getStores', middleware.verify, storeController.getStores)


router.get('/stores/getStoresDetails', middleware.verify, storeController.getVaultDetails);

// stores routes

// endpoint for saving credio
router.post("/stores/histories", middleware.verify, storeController.notifications);

// endpoint for saving card
router.post("/stores/payment", middleware.verify, storeController.payToStore);

// endpoint for saving other banks

// transfer from primary wallet 

router.put("/store/primaryWallet/withdraw", middleware.verify, storeController.withdrawFromWallet);

router.put("/store/primaryWallet/walletToPrimaryWallet", middleware.verify, storeController.walletToPrimaryWallet);

router.put("/store/primaryWallet/walletToDomicilary", middleware.verify, storeController.walletToDomicilary);


// store


// POST method route
module.exports = router;