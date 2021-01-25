import CryptoJS from 'crypto-js';

let DES_ENCRYPT_KEY = "ni3Txxh7WoEro90A";

// DES加密
export const encryptByDES = (message) => {
    var keyHex = CryptoJS.enc.Utf8.parse(DES_ENCRYPT_KEY);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

// DES解密
export const decryptByDES = (ciphertext) => {
    var keyHex = CryptoJS.enc.Utf8.parse(DES_ENCRYPT_KEY);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}