const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    customerName: {
        type: String,
        required: false,
        unique: true,
      },
      customerCity: {
        type: String,
        required: false,
      },
      customerDistrict: {
        type: String,
        required: false,
      },
      customerAddress: {
        type: String,
        required: false,
      },
      customerTaxOffice: {
        type: String,
        required: false,
      },
      customerTaxNumber: {
        type: String,
        required: false,
      },
      customerCurrency: {
        type: String,
        required: false,
        enum: ['TRY', 'USD', 'EUR'],
      },
      customerTC: {
        type: String,
        required: false,
        length: 11,
      },
      customerContactPerson: {
        type: String,
        required: false,
      },
      customerPhoneNumber: {
        type: String,
        required: false,
        length: 10,
      },
      customerMobileNumber: {
        type: String,
        required: false,
        length: 10,
      },
      customerEmail: {
        type: String,
        required: false,
      },
      customerNote: {
        type: String,
        required: false,
      },
      customerTotalDebt: {
        type: Number,
        default: 0,
        min: 0,
      },
      customerTotalReceivable: {
        type: Number,
        default: 0,
        min: 0,
      },
      customerCreated: {
        type: Date,
        default: Date.now,
      },
      customerCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
});

// pre hook to remove customer transactions when a customer is deleted
CustomerSchema.pre('findOneAndDelete', async function(next) {
    const customerId = this.getQuery()._id;

    // Find and delete customer transactions
    await mongoose.model('CustomerTransaction').deleteMany({ customer: customerId });

    next();
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;