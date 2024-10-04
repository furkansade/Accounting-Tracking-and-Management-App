const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  creditCardBank: {
    type: String,
  },
  creditCardAccount: {
    type: String,
  },
  creditCardType: {
    type: String,
    enum: ['Kredi Kartı', 'Eksi Hesap'],
  },
  creditCardCutOffDate: {
    type: Number,
  },
  creditCardLimit: {
    type: Number,
    default: 0,
  },
  creditCardAvailableLimit: {
    type: Number,
    default: 0,
  },
  creditCardDebt: {
    type: Number,
    default: 0,
  },
},{ timestamps: true });

const CreditCard = mongoose.model('CreditCard', creditCardSchema);

module.exports = CreditCard;