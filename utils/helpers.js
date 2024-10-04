function getBadgeClass(orderStatus) {
    switch (orderStatus) {
      case 'Beklemede':
        return 'warning';
      case 'Onaylandi':
        return 'info';
      case 'Gonderildi':
        return 'primary';
      case 'Tamamlandi':
        return 'success';
      case 'Iptal':
        return 'danger';
      case 'Iade':
        return 'secondary';
      default:
        return 'light';
    }
  }

function getBadgeClassDebt(transActionType) {
  switch (transActionType) {
    case 'Borç':
      return 'danger';
    case 'Alacak':
      return 'success';
    default:
      return 'success';
  }
}

function totalColor(total) {
  if (total < 0) {
    return 'danger';
  } else {
    return 'success';
  }
};

function getCurrencySymbol(currency) {
  switch (currency) {
    case 'TRY':
      return '₺';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return '||';
  }
}

function httpMethodColor(method) {
  switch (method) {
    case 'GET':
      return 'primary';
    case 'POST':
      return 'success';
    case 'PUT':
      return 'warning';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
};
  
module.exports = { getBadgeClass, getBadgeClassDebt, totalColor, getCurrencySymbol, httpMethodColor };
  