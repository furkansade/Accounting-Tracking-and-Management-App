const Loan = require('../../models/Loan.js');

exports.createLoan = async (req, res) => {
  try {
    
    const { 
      loanBank, 
      loanFirstInstallmentDate, 
      loanAmount, 
      loanNumberOfInstallments 
    } = req.body;

    const loanAmountValue = loanAmount ? parseFloat(loanAmount) : 0;
    const loanNumberOfInstallmentsValue = loanNumberOfInstallments ? parseInt(loanNumberOfInstallments, 10) : 0;

    const loan = new Loan({
      loanBank,
      loanFirstInstallmentDate,
      loanAmount: loanAmountValue,
      loanNumberOfInstallments: loanNumberOfInstallmentsValue
    });

    await loan.save();

    req.flash('success', 'Kredi başarıyla oluşturuldu.');
    res.status(201).redirect('/admin/loans');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('/admin/loans');
  }
};

exports.installmentPaid = async (req, res) => {
  try {
    const { id, index } = req.params;
    const loan = await Loan.findById(id);

    if(!loan) {
      req.flash('error', 'Kredi bulunamadı.');
      return res.status(404).redirect('/admin/loans');
    }

    const installment = loan.loanInstallments.find(i => i._id.toString() === index);

    if(!installment) {
      req.flash('error', 'Taksit bulunamadı.');
      return res.status(404).redirect('/admin/loans');
    }

    installment.installmentStatus = !installment.installmentStatus;

    await loan.save();

    req.flash('success', 'Taksit başarıyla güncellendi.');
    res.status(200).redirect('/admin/loans');
  } catch (error) {
    
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);

    if(!loan) {
      req.flash('error', 'Kredi bulunamadı.');
      return res.status(404).redirect('/admin/loans');
    }

    await loan.deleteOne();

    req.flash('success', 'Kredi başarıyla silindi.');
    res.status(200).redirect('/admin/loans');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('/admin/loans');
  }
};