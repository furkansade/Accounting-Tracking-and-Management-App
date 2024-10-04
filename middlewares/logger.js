const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Tarih ve saat token'ı ekleyin
morgan.token('date', () => {
  return new Date().toISOString();
});

// Morgan'a custom token ekleyin
morgan.token('user', (req) => {
  return req.user ? `User: ${req.user.email}` : 'Guest';
});

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const logFormat = ':remote-addr :date :method :url :status :user :body';

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs', 'access.log'), { flags: 'a' });

const logger = morgan(logFormat, { 
  stream: accessLogStream,
  skip: (req) => {
    // Sadece belirli GET isteklerini loglamak için koşullar
    if (req.method === 'GET') {
      const url = req.url;
      // İlgisiz GET isteklerini hariç tutmak için örnek koşullar
      return url.includes('/favicon.ico') || 
             url.includes('/static/') || 
             url.match(/\.(js|css|png|jpg|jpeg|gif|woff|woff2|ttf|svg)$/);
    }
    return false; // Diğer tüm istekleri logla
  }
});

module.exports = logger;
