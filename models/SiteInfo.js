const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SiteInfoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    socialMedia: {
      type: {
          twitter: String,
          linkedin: String,
          instagram: String,
          youtube: String 
      }
  }
});

const SiteInfo = mongoose.model('SiteInfo', SiteInfoSchema);

SiteInfo.findOne({})
    .then(siteInfo => {
        if (!siteInfo) {
            SiteInfo.create({
                title: 'MMA Muhasebe',
                description: 'MMA Muhasebe ve Danışmanlık Hizmetleri',
                email: 'iletisim@gmail.com',
                phone: '0555 555 55 55',
                address: 'İstanbul, Türkiye',
                socialMedia: {
                    twitter: 'https://twitter.com',
                    linkedin: 'https://linkedin.com',
                    instagram: 'https://instagram.com',
                    youtube: 'https://youtube.com'
                },
            });
        }
    }
    );



module.exports = SiteInfo;