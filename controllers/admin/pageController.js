const path = require("path");
const fs = require("fs");

const Employee = require("../../models/Employee.js");
const User = require("../../models/User.js");
const SiteInfo = require("../../models/SiteInfo.js");

const { getBadgeClassDebt, totalColor, getCurrencySymbol, httpMethodColor } = require("../../utils/helpers.js");

const Customer = require("../../models/Customer.js");
const CustomerTransaction = require("../../models/CustomerTransaction.js");
const CashLedger = require("../../models/CashLedger.js");
const CreditCard = require("../../models/CreditCard.js");
const Loan = require("../../models/Loan.js");


const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
};

function formatDateForInputDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}

function formatCurrency(amount) {

  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Geçersiz tutar'; // Hata durumunda dönecek mesaj
  }

  // Sayıyı iki ondalık basamağa yuvarla
  let parts = amount.toFixed(2).split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1];

  // Binlik ayraçları ekle
  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedIntegerPart},${decimalPart}`;
}


exports.adminHomePage = async (req, res) => {
  try {

    res.status(200).render("admin/index", {
      title: "dashboard",
      breadcrumbs: "Profil",
      formatDateForInputDate,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminSiteInfoPage = async (req, res) => {

  try {
    const siteInfo = await SiteInfo.findOne({});
  
    res.status(200).render("admin/site_info", {
      title: "siteinfo",
      breadcrumbs: "Site Bilgileri",
      siteInfo,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
    res.status(500).redirect("back");
  }
};

exports.adminUsersPage = async (req, res) => {
  try {

    const users = await User.find({}).sort({ createdAt: -1 });

    res.status(200).render("admin/users", {
      title: "users",
      breadcrumbs: "Kullanıcılar",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
}

exports.adminLoginPage = async (req, res) => {
  res.status(200).render("admin/login", {
    title: "login",
    breadcrumbs: "Giriş",
  });
};

const calculateBalances = (customers, customerTransactions) => {
  customers.forEach(customer => {
    customer.totalDebt = 0;
    customer.totalReceivable = 0;
    customer.totalBalance = 0;
  });

  customerTransactions.forEach(transaction => {
    const customer = customers.find(c => c._id.toString() === transaction.customer.toString());
    if (customer) {
      if (transaction.transactionType === "Borç") {
        customer.totalDebt += transaction.transactionAmount;
      } else if (transaction.transactionType === "Alacak") {
        customer.totalReceivable += transaction.transactionAmount;
      }
    }
  });

  customers.forEach(customer => {
    customer.totalBalance = customer.totalReceivable - customer.totalDebt;
  });
};

const calculateTotals = (customers, currency) => {
  const totals = {
    totalDebt: 0,
    totalReceivable: 0,
    totalBalance: 0,
    negativeBalance: 0
  };

  customers.forEach(customer => {
    if (customer.customerCurrency === currency) {
      totals.totalDebt += customer.totalDebt;
      totals.totalReceivable += customer.totalReceivable;
      if (customer.totalBalance > 0) {
        totals.totalBalance += customer.totalBalance;
      } else {
        totals.negativeBalance += customer.totalBalance;
      }
    }
  });

  return totals;
};

exports.adminCustomersPage = async (req, res) => {
  try {
    const [customers, customerTransactions] = await Promise.all([
      Customer.find({}).collation({ locale: "tr", strength: 2 }).sort({ customerName: 1 }),
      CustomerTransaction.find()
    ]);

    calculateBalances(customers, customerTransactions);

    const totalTLDebt = calculateTotals(customers, "TRY").totalDebt;
    const totalTLReceivable = calculateTotals(customers, "TRY").totalReceivable;
    const totalEURDebt = calculateTotals(customers, "EUR").totalDebt;
    const totalEURReceivable = calculateTotals(customers, "EUR").totalReceivable;
    const totalUSDDebt = calculateTotals(customers, "USD").totalDebt;
    const totalUSDReceivable = calculateTotals(customers, "USD").totalReceivable;

    const totalBalanceTL = calculateTotals(customers, "TRY").totalBalance;
    const totalBalanceEUR = calculateTotals(customers, "EUR").totalBalance;
    const totalBalanceUSD = calculateTotals(customers, "USD").totalBalance;

    const negativeBalanceTL = calculateTotals(customers, "TRY").negativeBalance;
    const negativeBalanceEUR = calculateTotals(customers, "EUR").negativeBalance;
    const negativeBalanceUSD = calculateTotals(customers, "USD").negativeBalance;

    res.status(200).render("admin/customers", {
      title: "customers",
      breadcrumbs: "Cariler",
      customers,
      totalColor,
      getCurrencySymbol,
      totalTLDebt,
      totalTLReceivable,
      totalEURDebt,
      totalEURReceivable,
      totalUSDDebt,
      totalUSDReceivable,
      totalBalanceTL,
      totalBalanceEUR,
      totalBalanceUSD,
      negativeBalanceTL,
      negativeBalanceEUR,
      negativeBalanceUSD,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminCustomerDetailPage = async (req, res) => {
  try {

    const { customerStartDate, customerEndDate } = req.query;

    const query = {};

    if (customerStartDate && customerEndDate) {
      query.transactionDate = { $gte: new Date(customerStartDate), $lte: new Date(customerEndDate) };
    }

    const customer = await Customer.findById(req.params.id);
    const customerTransactions = await CustomerTransaction.find({ customer: req.params.id, ...query }).sort({ transactionDate: -1 });

    // borc ve alacak hesaplamaları
    let sumDebt = 0;
    let sumReceivable = 0;


    customerTransactions.forEach(transaction => {
      let type = transaction.transactionType;
      let amount = transaction.transactionAmount;

      if (type === "Borç") {
        sumDebt += amount;
      } else if (type === "Alacak") {
        sumReceivable += amount;
      }
    
    });

    const total = sumReceivable - sumDebt;


    for(let j = 0; j < customerTransactions.length; j++) {
      customerTransactions[j].formattedTransactionDate = formatDateForInput(customerTransactions[j].transactionDate);
      customerTransactions[j].formattedTransactionAmount = formatCurrency(customerTransactions[j].transactionAmount);
    }

    let currentDate = new Date();
    let formmattedCurrentDate = formatDateForInputDate(currentDate);


    res.status(200).render("admin/customers/singleCustomer", {
      title: "customer",
      breadcrumbs: customer.customerName,
      parent: "Cariler",
      parentLink: "/admin/customers",
      customer,
      customerTransactions,
      customerStartDate,
      customerEndDate,
      getBadgeClassDebt,
      sumDebt,
      sumReceivable,
      total,
      customerCurrency: customer.customerCurrency,
      getCurrencySymbol,
      formmattedCurrentDate,
      totalColor,
      formatDateForInputDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminCashLedgerPage = async (req, res) => {
  try {

    const { cashLedgerStartDate, cashLedgerEndDate } = req.query;

    const query = {};

    if (cashLedgerStartDate && cashLedgerEndDate) {
      query.cashLedgerDate = { $gte: new Date(cashLedgerStartDate), $lte: new Date(cashLedgerEndDate) };
    }

    const cashLedgers = await CashLedger.find(query).sort({ cashLedgerDate: -1 });

    for(let i = 0; i < cashLedgers.length; i++) {
      cashLedgers[i].formattedCashLedgerDate = formatDateForInput(cashLedgers[i].cashLedgerDate);
      cashLedgers[i].formattedCashLedgerAmount = formatCurrency(cashLedgers[i].cashLedgerAmount);
    }

    const totalCashLedgerAmount = cashLedgers.reduce((acc, ledger) => {
      if (ledger.cashLedgerType === "Gelir") {
        return acc + ledger.cashLedgerAmount;
      } else if (ledger.cashLedgerType === "Gider") {
        return acc - ledger.cashLedgerAmount;
      } else {
        return acc; // Diğer türler varsa, acc'yi değiştirme
      }
    }, 0);

    let totalCashLedgerGelir = cashLedgers.reduce((acc, ledger) => {
      if (ledger.cashLedgerType === "Gelir") {
        return acc + ledger.cashLedgerAmount;
      } else {
        return acc;
      }
    }, 0);

    let totalCashLedgerGider = cashLedgers.reduce((acc, ledger) => {
      if (ledger.cashLedgerType === "Gider") {
        return acc + ledger.cashLedgerAmount;
      } else {
        return acc;
      }
    }, 0);

    let currentDate = new Date();
    let formmattedCurrentDate = formatDateForInputDate(currentDate);
    

    const cashLedgerCategories = ["KİRA", "FATURA", "REKLAM", "VERGİ", "SGK", "BAĞKUR", "MARKET", "KIRTASİYE", "HIRDAVAT", "DEMİRBAŞ", "MÜŞTERİ İÇİN ALIŞ", "MAAŞ", "FİRMA", "DİĞER"];

    // gider
    let cashLedgerCategoriesData = cashLedgerCategories.map(category => {
      let totalAmount = cashLedgers.reduce((acc, ledger) => {
        if (ledger.cashLedgerCategory === category && ledger.cashLedgerType === "Gider") {
          return acc + ledger.cashLedgerAmount;
        }
        return acc;
      }, 0);
      return totalAmount;
    });

    // gelir
    let cashLedgerCategoriesDataGelir = cashLedgerCategories.map(category => {
      let totalAmount = cashLedgers.reduce((acc, ledger) => {
        if (ledger.cashLedgerCategory === category && ledger.cashLedgerType === "Gelir") {
          return acc + ledger.cashLedgerAmount;
        }
        return acc;
      }, 0);
      return totalAmount;
    });
    

    res.status(200).render("admin/cashLedger", {
      title: "cashLedger",
      breadcrumbs: "Kasa Defteri",
      cashLedgers,
      cashLedgerCategories,
      totalCashLedgerAmount,
      cashLedgerStartDate,
      cashLedgerEndDate,
      totalCashLedgerGelir,
      totalCashLedgerGider,
      formmattedCurrentDate,
      formatDateForInputDate,
      cashLedgerCategoriesData,
      cashLedgerCategoriesDataGelir,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminEmployeeDetailPage = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);


    const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const workTypes = ["Full Time", "Part Time", "Remote", "Stajyer", "Dönemsel"];

    const formattedStartDate = formatDateForInputDate(employee.employeeStartDate);
    const formattedExitDate = formatDateForInputDate(employee.employeeExitDate);

    const leaveDates = employee.employeeLeaveDates.sort((a, b) => new Date(b.leaveDate) - new Date(a.leaveDate));

    for(let i = 0; i < leaveDates.length; i++) {
      leaveDates[i].formattedLeaveDate = formatDateForInput(leaveDates[i].leaveDate);
    }

    const totalLeaveDays = leaveDates.length;

    const remainingLeaveDays = employee.employeeLeaveDays - totalLeaveDays;

    let currentDate = new Date();
    let formmattedCurrentDate = formatDateForInputDate(currentDate);

    res.status(200).render("admin/employees/singleEmployee", {
      title: "employee",
      breadcrumbs: employee.employeeFullName,
      parent: "Çalışanlar",
      parentLink: "/admin/employees",
      employee,
      days,
      formattedStartDate,
      formattedExitDate,
      workTypes,
      leaveDates,
      remainingLeaveDays,
      formmattedCurrentDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminEmployeesPage = async (req, res) => {
  try {
    const employees = await Employee.find(
      {},
      'employeeFullName employeeStartDate employeeExitDate employeeDeleted'
    ).sort({ createdAt: -1 });

    for(let i = 0; i < employees.length; i++) {
      employees[i].formattedEmployeeStartDate = formatDateForInput(employees[i].employeeStartDate);
    }

    // deleted employees
    const deletedEmployees = await Employee.find({ employeeDeleted: { $ne: null } }).sort({ employeeDeleted: -1 });

    res.status(200).render("admin/employees", {
      title: "employees",
      breadcrumbs: "Çalışanlar",
      employees,
      deletedEmployees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminCreateEmployeePage = async (req, res) => {
 try {

  res.status(200).render("admin/employees/createEmployee", {
    title: "employee",
    parent: "Çalışanlar",
    parentLink: "/admin/employees",
    breadcrumbs: "Yeni Çalışan",
  });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminExitedEmployeesPage = async (req, res) => {
  try {
    const exitedEmployees = await Employee.find(
      { employeeExitDate: { $ne: null } },
      'employeeFullName employeeStartDate employeeExitDate'
    ).sort({ employeeExitDate: -1 });

    for(let i = 0; i < exitedEmployees.length; i++) {
      exitedEmployees[i].formattedEmployeeStartDate = formatDateForInput(exitedEmployees[i].employeeStartDate);
      exitedEmployees[i].formattedEmployeeExitDate = formatDateForInput(exitedEmployees[i].employeeExitDate);
    }


    res.status(200).render("admin/employees/exitedEmployees", {
      title: "employee",
      parent: "Çalışanlar",
      breadcrumbs: "İşten Ayrılan Çalışanlar",
      exitedEmployees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
  }
};

exports.adminNewCustomersPage = async (req, res) => {
  try {
    
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    const customerTransactions = await CustomerTransaction.find();

    for(let i = 0; i < customers.length; i++) {
      customers[i].toplamAlacak = 0;
      customers[i].toplamBorc = 0;
      customers[i].toplamBakiye = 0;
    }

    for(let i = 0; i < customerTransactions.length; i++) {
      for(let j = 0; j < customers.length; j++) {
        if(customerTransactions[i].customer.toString() === customers[j]._id.toString()) {
          if(customerTransactions[i].transactionType === "Borç") {
            customers[j].toplamBorc += customerTransactions[i].transactionAmount;
          } else if(customerTransactions[i].transactionType === "Alacak") {
            customers[j].toplamAlacak += customerTransactions[i].transactionAmount;
          }
        }
      }
    }

    for(let i = 0; i < customers.length; i++) {
      customers[i].toplamBakiye = customers[i].toplamAlacak - customers[i].toplamBorc;
    }

    res.status(200).render("admin/customers/newCustomers", {
      title: "newCustomers",
      breadcrumbs: "Yeni Cari",
      customers,
      totalColor,
      getCurrencySymbol,
    });

  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
    res.status(500).redirect("back");
  }
};

exports.adminLogsPage = async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '../../logs', 'access.log');
    const logs = [];

    // Log dosyasını okuyun ve satır satır ayrıştırın
    const data = fs.readFileSync(logFilePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach(line => {
      if (line.trim() !== '') {
        const logParts = line.split(' ');

        // Tarih ve saati formatla
        const logDate = new Date(logParts[1]);
        const formattedDate = logDate.toLocaleDateString();
        const formattedTime = logDate.toLocaleTimeString();

        let user = logParts.slice(5, 7).join(' ');

         // '/admin/auth/login' URL'sine yapılan POST isteklerinde parolayı maskele
         if (logParts[3] === '/admin/auth/login' && logParts[2] === 'POST') {
          user = user.replace(/"password":"(.*?)"/, '"password":"********"');
        }

        const log = {
          ip: logParts[0],
          date: formattedDate,
          time: formattedTime,
          method: logParts[2],
          url: logParts[3],
          status: logParts[4],
          user: user,
          body: logParts.slice(7).join(' '),
        };

        // Yalnızca ilgisiz GET isteklerini hariç tutmak için koşullar
        if (!(log.method === 'GET' && (log.url.includes('/favicon.ico') || 
             log.url.includes('/static/') || 
             log.url.match(/\.(js|css|png|jpg|jpeg|gif|woff|woff2|ttf|svg)$/)))) {
          logs.push(log);
        }
      }
    });

    res.status(200).render("admin/logs", {
      title: "logs",
      breadcrumbs: "İşlemler",
      logs: logs,
      httpMethodColor,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
    res.status(500).redirect('/admin'); // veya hata sayfasına yönlendirme
  }
};

exports.adminCreditCardsPage = async (req, res) => {
  try {
    const creditCards = await CreditCard.find({}).sort({ createdAt: 1 });

    for(let i = 0; i < creditCards.length; i++) {
      creditCards[i].formattedCreditCardLimit = formatCurrency(creditCards[i].creditCardLimit);
      creditCards[i].formattedCreditCardAvailableLimit = formatCurrency(creditCards[i].creditCardAvailableLimit);
      creditCards[i].formattedCreditCardDebt = formatCurrency(creditCards[i].creditCardDebt);
    }

    let totalCreditCardLimit = 0;
    let totalCreditCardAvailableLimit = 0;
    let totalCreditCardDebt = 0;

    for(creditCard of creditCards) {
      totalCreditCardLimit += creditCard.creditCardLimit;
      totalCreditCardAvailableLimit += creditCard.creditCardAvailableLimit;
      totalCreditCardDebt += creditCard.creditCardDebt;
    }

    res.status(200).render("admin/creditCards", {
      title: "creditCards",
      breadcrumbs: "Kredi Kartları",
      creditCards,
      totalColor,
      totalCreditCardLimit,
      totalCreditCardAvailableLimit,
      totalCreditCardDebt,
      formatCurrency,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
    res.status(500).redirect("back");
  }
};

exports.adminLoansPage = async (req, res) => {
  try {
    const loans = await Loan.find({}).sort({ createdAt: 1 });

    let totalLoansAmount = 0;
    let totalReamingDebt = 0;
    let totalPaidDebt = 0;

    loans.forEach((loan) => {
      totalLoansAmount += loan.loanAmount;

      let paidAmount = 0;

      loan.loanInstallments.forEach((installment) => {
        if (installment.installmentStatus) {
          paidAmount += installment.installmentAmount;
        } else {
          totalReamingDebt += installment.installmentAmount;
        }
      });

      loan.remainingDebt = loan.loanAmount - paidAmount;
      totalPaidDebt += paidAmount;
    });
	  
	  loans.forEach((loan) => {
		  let firstUnpaidInstallment = loan.loanInstallments.find(installment => !installment.installmentStatus);
		  if (firstUnpaidInstallment) {
			loan.firstUnpaidInstallmentDate = formatDateForInput(firstUnpaidInstallment.installmentDate);
		  }
	  });

    let currentDate = new Date();
    let formmattedCurrentDate = formatDateForInputDate(currentDate);

    res.status(200).render("admin/loans", {
      title: "loans",
      breadcrumbs: "Krediler",
      loans,
      totalLoansAmount,
      totalReamingDebt,
      totalPaidDebt,
      formatCurrency,
      formmattedCurrentDate
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Bir hata oluştu! Lütfen tekrar deneyin.");
    res.status(500).redirect("back");
  }
};
