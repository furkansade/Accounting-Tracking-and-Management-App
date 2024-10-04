const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loanSchema = new Schema({
  loanBank: {
    type: String,
  },
  loanAmount: {
    type: Number,
    default: 0
  },
  loanNumberOfInstallments: {
    type: Number,
    default: 0
  },
  loanFirstInstallmentDate: {
    type: Date,
  },
  loanInstallments: [{
    installmentDate: {
      type: Date,
    },
    installmentAmount: {
      type: Number,
    },
    installmentStatus: {
      type: Boolean,
      default: false
    }
  }]
},{ timestamps: true });

loanSchema.pre('save', function(next) {
  const loan = this;

  if(!loan.isModified('loanFirstInstallmentDate')) return next();

  const installmentAmount = loan.loanAmount / loan.loanNumberOfInstallments;
  const loanInstallments = [];

  for (let i = 0; i < loan.loanNumberOfInstallments; i++) {
    let installmentDate = new Date(loan.loanFirstInstallmentDate);
    installmentDate = installmentDate.setMonth(installmentDate.getMonth() + i);
    loanInstallments.push({
      installmentDate: installmentDate,
      installmentAmount: installmentAmount,
      installmentStatus: false,
    });
  }

  loan.loanInstallments = loanInstallments;
  next();

});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;