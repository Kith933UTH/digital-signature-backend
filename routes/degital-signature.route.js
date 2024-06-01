const express = require('express')
const router = express.Router()
const digitalSignature = require('../controllers/digital-signature.controller')

// generat key pair
router.route('/generate-key-pair').get(digitalSignature.generateKeyPair)

// sign 
router.route('/sign').post(digitalSignature.sign)

// verify
router.route('/verify').post(digitalSignature.verify)

module.exports = router;