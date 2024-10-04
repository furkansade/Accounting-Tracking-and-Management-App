const express = require('express');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const cloudinary = require('cloudinary').v2;
const moment = require('moment');
const cookieParser = require('cookie-parser');


const dotenv = require('dotenv');
const connectToDatabase = require('./db');
const logger = require('./middlewares/logger.js');

const SiteInfo = require('./models/SiteInfo.js');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


connectToDatabase();


const siteInfoRoutes = require('./routes/admin/siteInfoRoutes.js');
const userRoutes = require('./routes/admin/userRoutes.js');
const employeeRoutes = require('./routes/admin/employeeRoutes.js');
const adminPageRoutes = require('./routes/admin/pageRoutes.js');
const authRoutes = require('./routes/admin/authRoutes.js');

const customerRoutes = require('./routes/admin/customerRoutes.js');
const customerTransactionRoutes = require('./routes/admin/customerTransactionRoutes.js');
const cashLedgerRoutes = require('./routes/admin/cashLedgerRoutes.js');
const creditCardRoutes = require('./routes/admin/creditCardRoutes.js');
const loanRoutes = require('./routes/admin/loanRoutes.js');

const { checkUser } = require('./middlewares/authMiddleware.js');


const app = express();

app.locals.moment = moment;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Anlık giriş yapan kullanıcıyı yakalamak için checkUser middleware'ını kullanın
app.use(checkUser);

app.use(logger);


app.use(express.static("public"));

app.use(
  session({
    secret: "my_keyboard-cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
    }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(fileUpload({ useTempFiles: true }));
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// locals siteInfo
app.use(async (req, res, next) => {
  try {
    const siteInfo = await SiteInfo.findOne({});
    res.locals.siteInfo = siteInfo;
    next();
  } catch (error) {
    console.log(error);
  }
});


// Redirect / to /admin
app.get('/', (req, res) => {
  res.redirect('/admin');
});

//SITE ROUTES
app.get('*', checkUser);

//ADMIN ROUTES
app.use('/admin', adminPageRoutes);
app.use('/admin/site-info', siteInfoRoutes);
app.use('/admin/users', userRoutes);
app.use('/admin/auth', authRoutes);

app.use('/admin/customers', customerRoutes);
app.use('/admin/customer-transactions', customerTransactionRoutes);

app.use('/admin/cash-ledger', cashLedgerRoutes);

app.use('/admin/employees', employeeRoutes);

app.use('/admin/credit-cards', creditCardRoutes);
app.use('/admin/loans', loanRoutes)

// 404 page
app.use((req, res) => {
  res.status(404).render('admin/404', {title: 'Sayfa Bulunamadı'});
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});