const Customer = require('../../models/Customer');
const mongoose = require('mongoose');

const stockCrudController = require('./stockCrudController');

exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();

        req.flash("success", "Müşteri başarıyla oluşturuldu.");
        res.status(201).redirect('back');
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
    };
};

exports.deleteCustomer = stockCrudController.deleteOne(Customer);

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            req.flash("error", "Müşteri bulunamadı.");
            return res.status(404).redirect('back');
        }

        Object.keys(req.body).forEach(field => {
            customer[field] = req.body[field];
        });

        await customer.save();

        req.flash("success", "Müşteri başarıyla güncellendi.");
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
