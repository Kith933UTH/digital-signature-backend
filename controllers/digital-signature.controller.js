const crypto = require('crypto')
const publicKeyBase64UrlLength = 392 // standard length for public key which create from rsa type and modulusLength is 2048

// generate key pair
const generateKeyPair = (req, res) => {

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der'
        }
    })

    return res.json({ publicKey: publicKey.toString('base64url'), privateKey: privateKey.toString('base64url')})
}

// sign
const sign = (req, res) => {

    let { privateKey, data } = req.body

    privateKey = crypto.createPrivateKey({
        key: Buffer.from(privateKey, 'base64url'),
        type: 'pkcs8',
        format: 'der'
    })

    const sign = crypto.createSign('SHA256')
    sign.update(data)
    sign.end()
    const signature = sign.sign(privateKey).toString('base64url')

    return res.json({ data, signature })
}

// verify
const verify = (req, res) => {

    let { data, publicKey, signature } = req.body

    if (publicKey.length > publicKeyBase64UrlLength) return res.json({ verify: false })

    try {
        publicKey = crypto.createPublicKey({
            key: Buffer.from(publicKey, 'base64url'),
            type: 'spki',
            format: 'der'
        })
    } catch (err) {
        return res.json({ verify: false })
    }

    const verify = crypto.createVerify('SHA256')
    verify.update(data)
    verify.end()

    const result = verify.verify(publicKey, Buffer.from(signature, 'base64url'));
    return res.json({ verify: result })
}

module.exports = {
    generateKeyPair,
    sign,
    verify
}