const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const checkCreate = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).redirect("/admin");
      } else {
        try {
          const user = await User.findById(decodedToken.userId);
          if (user && (user.role === 'admin' || user.role === 'user')) {
            res.locals.user = user;
            next();
          } else {
            req.flash("error", "Yapmak istediğiniz işlem için yetkiniz yok.");
            return res.status(403).redirect("/admin");
          }
        } catch (e) {
          req.flash("error", "Bir hata oluştu, lütfen tekrar deneyin.");
          return res.status(500).redirect("/admin");
        }
      }
    });
  } else {
    req.flash("error", "Şu anda bu sayfa için izniniz yok.");
    return res.status(401).redirect("/admin");
  }
};

module.exports = {
  checkCreate,
};
