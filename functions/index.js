/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("isomorphic-fetch");
admin.initializeApp();

const apiKey = functions.config().exchangerate.key;

exports.convertCurrency = functions.database
    .ref("/expenses/{userId}/{expenseId}")
    .onCreate(async (snap, context) => {
      const expense = snap.val();
      const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      const data = await response.json();
      const exchangeRates = data.conversion_rates;
      const rateFrom = exchangeRates[expense.currency];
      const rateTo = exchangeRates[expense.displayCurrency];
      const displayAmount = (expense.amount / rateFrom) * rateTo;
      return snap.ref.child("displayAmount").set(displayAmount);
    });
