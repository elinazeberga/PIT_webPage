const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], default: 'user' },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNr: { type: String, required: false }, // No need for registration or admins
    loyalty: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze' }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
      }
      next();
    });
    
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
