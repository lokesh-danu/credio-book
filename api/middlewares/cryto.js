const fs = require('fs')

const JSEncrypt = require('node-jsencrypt');
const public = fs.readFileSync('./keys/public.pem',
    { encoding: 'utf8', flag: 'r' });

const private = fs.readFileSync('./keys/private.pem',
    { encoding: 'utf8', flag: 'r' });
        module.exports.enc = function encrypt(text) {
    const crypt = new JSEncrypt();
    crypt.setKey(public);
    var ss = crypt.encrypt(text);
    console.log(ss);
    return ss;
}

module.exports.dec = function decrypt(encrypted) {
    console.log(encrypted);
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(private);

    var ss = crypt.decrypt(encrypted);
    console.log(ss);
    return ss;
}


