const User = require("../../models/User.js");

const createUser = async (req, res) => {
    try {
        const users = await User.find();
        const missingFields = validateRequiredFields(req.body);
        
        if (missingFields.length > 0) {
            handleValidationErrors(req, res, missingFields);
            return;
        }

        if (isEmailExists(users, req.body.email)) {
            handleDuplicateError(req, res, 'Bu emaile sahip kullanıcı zaten var.');
            return;
        }

        await createUserInDb(req.body);

        req.flash('success', 'Kullanıcı başarıyla oluşturuldu.');
        res.status(201).redirect('/admin/users');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        res.status(400).redirect('back');
    }
};

const validateRequiredFields = (body) => {
    const fieldNames = {
        firstName: 'İsim',
        lastName: 'Soyisim',
        email: 'Email',
        password: 'Şifre',
        role: 'Rol',
    };
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role'];
    return requiredFields.filter(field => !body[field]).map(field => fieldNames[field]);
};

const handleValidationErrors = (req, res, missingFields) => {
    const errorMessage = "Eksik alanları doldurun: " + missingFields.join(', ') + ".";
    req.flash('error', errorMessage);
    res.status(400).redirect('back');
};

const isEmailExists = (users, email) => {
    return users.some(user => user.email === email);
};

const handleDuplicateError = (req, res, message) => {
    req.flash('error', message);
    res.status(400).redirect('back');
};

const createUserInDb = async (body) => {
    return await User.create({
        ...body,
    });
};

const deleteUser = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error', 'Kullanıcı bulunamadı.');
            res.status(404).redirect('/admin/users');
            return;
        }

        await user.deleteOne();

        req.flash('success', 'Kullanıcı başarıyla silindi.');
        res.status(200).redirect('/admin/users');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        res.status(400).redirect('/admin/users');
    }
};

const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error', 'Kullanıcı bulunamadı.');
            res.status(404).redirect('back');
            return;
        }

        if (!req.body.password) {
            req.flash('error', 'Yeni şifre alanı boş olamaz.');
            res.status(400).redirect('back');
            return;
        }

        user.password = req.body.password;

        await user.save();

        req.flash('success', 'Şifreniz güncellendi.');
        res.status(200).redirect('/admin');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        res.status(400).redirect('back');
    }
}

module.exports = {
    createUser,
    deleteUser,
    changePassword,
};
