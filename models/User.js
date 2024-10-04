const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guest', 'disabled'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// Pre-save hook to hash the password before saving the user
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

// yoksa oluştur
User.findOne({ email: 'sade@sade.com' })
  .then(user => {
    if (!user) {
      User.create({
        firstName: 'Sade',
        lastName: 'Sade',
        email: 'sade@sade.com',
        phone: '0555 555 55 55',
        birthDate: new Date('1990-01-01'),
        password: '123456',
        role: 'admin',
        isEmailVerified: true
      });
    }
  }
  );


module.exports = User;
