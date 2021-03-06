const env = process.env;

const firebase = require('firebase');
const twilio = require('twilio')(env.twilioSid, env.twilioAuth);
const lib = require('lib')({ token: env.STDLIB_LIBRARY_TOKEN });

firebase.initializeApp({
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    databaseURL: env.firebaseDatabaseURL,
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,
    messagingSenderId: env.firebaseMessagingSenderId
}, 'eventsApp');

const app = firebase.app("eventsApp");
const db = firebase.firestore(app);

/**
 * @param {string} number
 * @param {string} location
 */
module.exports = async (number, location, context) => {
    let usersRef = db.collection('users').doc(number);
    return usersRef.get().then((snapshot) => {
        if (!snapshot.exists) {
            return Promise.reject(`Phone number ${number} not found`);
        }

        let data = {
            phoneNumber: number,
            location: location
            }

        return usersRef.set(data, { merge: true });
    }).then(() => {
        return `Location for ${number} updated to ${location}.`;
    }).catch((err) => {
        return err;
    });
};
