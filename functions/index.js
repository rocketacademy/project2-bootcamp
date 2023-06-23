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
const db = admin.database();

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

exports.onDisplayCurrencyChange = functions.database
    .ref("/user/{userId}/displayCurrency")
    .onUpdate(async (change, context) => {
      const displayCurrency = change.after.val();

      const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      const data = await response.json();
      const exchangeRates = data.conversion_rates;

      const expensesRef = db.ref(`expenses/${context.params.userId}`);
      const expensesSnapshot = await expensesRef.once("value");
      const expenses = expensesSnapshot.val();

      for (const expenseId in expenses) {
        if (Object.prototype.hasOwnProperty.call(expenses, expenseId)) {
          const expense = expenses[expenseId];
          const rateFrom = exchangeRates[expense.currency];
          const rateTo = exchangeRates[displayCurrency];
          const displayAmount = (expense.amount / rateFrom) * rateTo;
          await expensesRef.child(`${expenseId}/displayAmount`)
              .set(displayAmount);
          await expensesRef.child(`${expenseId}/displayCurrency`)
              .set(displayCurrency);
        }
      }
    });
