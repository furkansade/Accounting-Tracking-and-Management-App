const CreditCard = require('../../models/CreditCard.js');

exports.createCreditCard = async (req, res) => {
  try {
    const { 
      creditCardBank, 
      creditCardAccount, 
      creditCardType, 
      creditCardCutOffDate, 
      creditCardLimit, 
      creditCardAvailableLimit 
    } = req.body;

    const creditCardLimitValue = creditCardLimit ? parseFloat(creditCardLimit) : 0;
    const creditCardAvailableLimitValue = creditCardAvailableLimit ? parseFloat(creditCardAvailableLimit) : 0;

    const creditCard = new CreditCard({
      creditCardBank,
      creditCardAccount,
      creditCardType,
      creditCardCutOffDate,
      creditCardLimit: creditCardLimitValue,
      creditCardAvailableLimit: creditCardAvailableLimitValue,
      creditCardDebt: creditCardLimitValue - creditCardAvailableLimitValue
    });

    await creditCard.save();

    req.flash("success", "Kredi kartı başarıyla oluşturuldu.");
    res.status(201).redirect('/admin/credit-cards');
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.status(500).redirect('/admin/credit-cards');
  }
};

exports.deleteCreditCard = async (req, res) => {
  try {
    
    const creditCard = await CreditCard.findById(req.params.id);

    if (!creditCard) {
      req.flash("error", "Kredi kartı bulunamadı.");
      return res.status(404).redirect('back');
    }

    await creditCard.deleteOne();

    req.flash("success", "Kredi kartı başarıyla silindi.");
    res.status(200).redirect('/admin/credit-cards');
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.status(500).redirect('/admin/credit-cards');
  }
};

exports.updateCreditCard = async (req, res) => {
  try {
    // Kredi kartını ID'ye göre bul
    const creditCard = await CreditCard.findById(req.params.id);

    if (!creditCard) {
      req.flash("error", "Kredi kartı bulunamadı.");
      return res.status(404).redirect('back');
    }

    // Formdan gelen verileri alın ve varsayılan değerlerle güncelleyin
    const {
      creditCardBank,
      creditCardAccount,
      creditCardType,
      creditCardCutOffDate,
      creditCardLimit,
      creditCardAvailableLimit
    } = req.body;

    // Varsayılan değerlerle creditCardLimit ve creditCardAvailableLimit'i ayarlayın
    const creditCardLimitValue = creditCardLimit ? parseFloat(creditCardLimit) : 0;
    const creditCardAvailableLimitValue = creditCardAvailableLimit ? parseFloat(creditCardAvailableLimit) : 0;

    // debt hesaplaması
    const creditCardDebtValue = creditCardLimitValue - creditCardAvailableLimitValue;

    // Güncellenmiş verilerle kredi kartını güncelle
    await creditCard.updateOne({
      creditCardBank: creditCardBank || creditCard.creditCardBank,
      creditCardAccount: creditCardAccount || creditCard.creditCardAccount,
      creditCardType: creditCardType || creditCard.creditCardType,
      creditCardCutOffDate: creditCardCutOffDate || creditCard.creditCardCutOffDate,
      creditCardLimit: creditCardLimitValue,
      creditCardAvailableLimit: creditCardAvailableLimitValue,
      creditCardDebt: creditCardDebtValue
    });

    req.flash("update", "Kredi kartı başarıyla güncellendi.");
    res.status(200).redirect('/admin/credit-cards');
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.status(500).redirect('/admin/credit-cards');
  }
};
