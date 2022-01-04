const express = require('express');
const router = express.Router();
const credioController = require('../controllers/credio_controller');

const middleware = require('../middlewares/auth');

// this endpoints are for Credio (User App).
// dashboard endpoints

router.get('/primaryCard', middleware.verify, credioController.primaryCard);
router.get('/getDomicilaryAccounts', middleware.verify, credioController.getDomicilaryAccount);
router.get('/getProfile', middleware.verify, credioController.getUserProfile);



// Credit

router.get('/getCreditScore', middleware.verify, credioController.getCreditScore);

router.post('/requestForCredit', middleware.verify, credioController.requestForLoan);





// payments


router.get('/getHistory', middleware.verify, credioController.histories);
router.get('/getRecentTransactions', middleware.verify, credioController.getRecentTransactions);

router.post('/cardToAccount', middleware.verify, credioController.cardToAccount);
router.post('/scanToAccount', middleware.verify, credioController.scanToAccount);
router.post('/cardToCard', middleware.verify, credioController.cardToCard);



router.get("/notifications", middleware.verify, credioController.notifications);
// Naira  wallet
// get primary wallet
router.get("/primaryWallet", middleware.verify, credioController.getPimaryWallet);

// fund primary wallet

router.patch("/primaryWallet/deposit", middleware.verify, credioController.saveToWallet);


// fund primary wallet

router.patch("/primaryWallet/set/upmost", middleware.verify, credioController.setUpmostToWallet);

// transfer from primary wallet 

router.put("/primaryWallet/withdraw", middleware.verify, credioController.withdrawFromWallet);

router.put("/primaryWallet/walletToWallet", middleware.verify, credioController.walletToWallet);

router.put("/primaryWallet/walletToDomicilary", middleware.verify, credioController.walletToDomicilary);


// POST method route
module.exports = router;