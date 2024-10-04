const CustomerTransaction = require('../../models/CustomerTransaction');
const stockCrudController = require('./stockCrudController');

exports.createCustomerTransaction = async (req, res) => {
    try {

        const transaction_amount = req.body.transactionAmount;
        const transaction_VAT = req.body.transactionVAT;

        req.body.transactionAmount = transaction_amount * (1 + (transaction_VAT / 100));

        await CustomerTransaction.create(req.body);

        req.flash('success', 'Cari işlem başarıyla oluşturuldu.');
        res.status(201).redirect('back');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Cari işlem oluşturulurken bir hata oluştu.');
        res.status(400).redirect('back');
    }
};
exports.deleteCustomerTransaction = stockCrudController.deleteOne(CustomerTransaction);

exports.updateCustomerTransaction = async (req, res) => {
    try {

        const transaction_amount = req.body.transactionAmount;
        const transaction_VAT = req.body.transactionVAT;

        req.body.transactionAmount = transaction_amount * (1 + (transaction_VAT / 100));

        await CustomerTransaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        req.flash('success', 'Cari işlem başarıyla güncellendi.');
        res.status(200).redirect('back');
        
    } catch (error) {
        console.error(error);
        req.flash('error', 'Cari işlem güncellenirken bir hata oluştu.');
        res.status(400).redirect('back');
    }
};