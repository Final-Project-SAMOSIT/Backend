const { initializeApp, cert } = require("firebase-admin/app")
const serviceAccount = require('./firebaseJson.json');

const firebaseAdminApp = initializeApp({ credential: cert(serviceAccount), storageBucket: serviceAccount.storageBucket })

module.exports = { firebaseAdminApp }