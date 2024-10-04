const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerTransactionSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  transactionDescription: {
    type: String,
    required: true,
  },
  transactionDomesticForeign: {
    type: String,
    enum: ["Domestic", "Foreign"], // en: ["Domestic", "Foreign"]
    required: true,
  },
  transactionQuantityHour: {
    type: String,
    enum: ["Adet", "Saat"],
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["Alacak", "Borç"],
    required: true,
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  transactionCurrency: {
    type: String,
    enum: ["TRY", "USD", "EUR"],
    required: true,
  },
  transactionVAT: {
    type: Number,
    enum: [0, 1, 10, 20, 14],
    required: true,
  },
  transactionCreated: {
    type: Date,
    default: Date.now,
  },
});

const CustomerTransaction = mongoose.model("CustomerTransaction", customerTransactionSchema);

module.exports = CustomerTransaction;