const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CashLedgerSchema = new Schema({
  cashLedgerDate: {
    type: Date,
    required: true,
  },
  cashLedgerTitle: {
    type: String,
    required: true,
  },
  cashLedgerType: {
    type: String,
    enum: ["Gelir", "Gider"],
    required: true,
  },
  cashLedgerCategory: {
    type: String,
    enum: ["KİRA", "FATURA", "REKLAM", "VERGİ", "SGK", "BAĞKUR", "MARKET", "KIRTASİYE", "HIRDAVAT", "DEMİRBAŞ", "MÜŞTERİ İÇİN ALIŞ", "MAAŞ", 'FİRMA', 'DİĞER'],
    required: true,
  },
  cashLedgerDescription: {
    type: String,
  },
  cashLedgerAmount: {
    type: Number,
    required: true,
  },
  cashLedgerCreated: {
    type: Date,
    default: Date.now,
  },
});

const CashLedger = mongoose.model("CashLedger", CashLedgerSchema);

module.exports = CashLedger;