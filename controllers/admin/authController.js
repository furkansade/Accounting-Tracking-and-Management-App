const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User.js");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Email ya da şifre hatalı.");
      return res.status(400).redirect("/admin/auth/open-the-gate");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Email ya da şifre hatalı.");
      return res.status(400).redirect("/admin/auth/open-the-gate");
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    req.flash("success", "Giriş başarılı.");
    res.status(200).redirect("/admin");
  } catch (error) {
    req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.status(400).redirect("/admin/auth/open-the-gate");
  }
};

const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

exports.logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/admin");
};


