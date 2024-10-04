const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

const CashLedger = require('../../models/CashLedger');
const stockCrudController = require('./stockCrudController');

exports.createCashLedger = async (req, res) => {
    try {
        const requiredFields = [
            'cashLedgerDate',
            'cashLedgerTitle',
            'cashLedgerType',
            'cashLedgerCategory',
            'cashLedgerAmount',
        ];

        let missingFields = [];

        requiredFields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            let errorMessage = "Eksik alanlar: " + missingFields.join(', ');
            req.flash("error", errorMessage);
            return res.status(400).redirect('back');
        }

        const cashLedger = new CashLedger(req.body);
        await cashLedger.save();

        req.flash("success", "Başarıyla eklendi.");
        res.status(201).redirect('back');
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            let errorMessage = "Doğrulama hatası:";
            for (let field in error.errors) {
                errorMessage += ` ${error.errors[field].message}`;
            }
            req.flash("error", errorMessage);
            return res.status(400).redirect('back');
        } else if (error.code === 11000) {
            // Handling unique constraint errors
            let uniqueField = Object.keys(error.keyValue)[0];
            let errorMessage = `Bu ${uniqueField} zaten mevcut: ${error.keyValue[uniqueField]}`;
            req.flash("error", errorMessage);
            return res.status(400).redirect('back');
        } else {
            req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
            res.status(500).redirect('back');
        }
    }
};

exports.deleteCashLedger = stockCrudController.deleteOne(CashLedger);

exports.updateCashLedger = async (req, res) => {
    try {
        const cashLedger = await CashLedger.findById(req.params.id);

        if (!cashLedger) {
            req.flash("error", "Müşteri bulunamadı.");
            return res.status(404).redirect('back');
        }

        Object.keys(req.body).forEach(field => {
            cashLedger[field] = req.body[field];
        });
       
        await cashLedger.save();

        req.flash("success", "Başarıyla güncellendi.");
        res.status(200).redirect('back');
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let errorMessage = "Doğrulama hatası:";
            for (let field in error.errors) {
                errorMessage += ` ${error.errors[field].message}`;
            }
            req.flash("error", errorMessage);
            return res.status(400).redirect('back');
        } else if (error.code === 11000) {
            // Unique constraint hatalarını ele alma
            let uniqueField = Object.keys(error.keyValue)[0];
            let errorMessage = `Bu ${uniqueField} zaten mevcut: ${error.keyValue[uniqueField]}`;
            req.flash("error", errorMessage);
            return res.status(400).redirect('back');
        } else {
            req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
            res.status(500).redirect('back');
        }
    }
};

exports.exportsCashLedgers = async (req, res) => {
    try {
        const { cashLedgerStartDate, cashLedgerEndDate } = req.query;

        const query = {};

        // Tarih filtrelerini kontrol edin ve query objesine ekleyin
        if (cashLedgerStartDate && cashLedgerEndDate) {
          query.cashLedgerDate = { $gte: new Date(cashLedgerStartDate), $lte: new Date(cashLedgerEndDate) };
        }

        const cashLedgers = await CashLedger.find(query);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kasa Defteri');

        worksheet.columns = [
            { header: 'Tarih', key: 'cashLedgerDate', width: 20, },
            { header: 'Başlık', key: 'cashLedgerTitle', width: 20 },
            { header: 'Tip', key: 'cashLedgerType', width: 20 },
            { header: 'Kategori', key: 'cashLedgerCategory', width: 20 },
            { header: 'Miktar', key: 'cashLedgerAmount', width: 20 },
        ];

        cashLedgers.forEach(cashLedger => {
            worksheet.addRow({
                cashLedgerDate: cashLedger.cashLedgerDate,
                cashLedgerTitle: cashLedger.cashLedgerTitle,
                cashLedgerType: cashLedger.cashLedgerType,
                cashLedgerCategory: cashLedger.cashLedgerCategory,
                cashLedgerAmount: cashLedger.cashLedgerAmount,
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'kasa-defteri.xlsx');

        await workbook.xlsx.write(res);
    } catch (error) {
        console.log(error);
        req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
        res.status(500).redirect('back');
    }
}