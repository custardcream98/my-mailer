const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const {
  serviceAccount,
} = require("./serviceAccount.config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAuth = getAuth();

const firestore = admin.firestore();

module.exports = { admin, firestore, firebaseAuth };
