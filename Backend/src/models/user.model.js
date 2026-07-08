import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        credits: {   // for credits management
            type: Number,
            required: true,
            min: 0,
            default: 10 // only 10 credits for free users
        },
        creditRefillTime: {
            type: Date,
            default: null // null means no refill timer active
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const userModel = mongoose.model('User', userSchema);

export default userModel;