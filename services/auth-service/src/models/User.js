import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'First name must be at least 2 characters'],
            maxlength: [50, 'First name must not exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters'],
            maxlength: [50, 'Last name must not exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: {
                values: ['patient', 'doctor', 'admin', 'superadmin'],
                message: 'Role must be patient, doctor, admin, or superadmin',
            },
            default: 'patient',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        profileImage: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Virtual for fullName creation
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual to display doctor name with Dr. prefix
userSchema.virtual('displayName').get(function() {
    if (this.role === 'doctor') {
        return `Dr. ${this.firstName} ${this.lastName}`;
    }
    return `${this.firstName} ${this.lastName}`; 
});

// Auto set isApproved based on role before first save 
userSchema.pre('save', async function() {
    if (this.isNew) {
        if (this.role === 'doctor') {
            this.isApproved = false;  // doctor need admin approval befor they can act
        } else {
            this.isApproved = true; // others have immediate access to system
        }
    }
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12); 
    }
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.toJSON = function() {
    const obj = this.toObject({ virtuals: true });
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);
export default User;