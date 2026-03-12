const getPasswordErrors = (password) => {
    const errors = [];

    if (!password) {
        errors.push('Password is required.');
        return errors;
    }
    if (password.length < 8)
        errors.push('Password must be at least 8 characters.');

    if (!/[A-Z]/.test(password))
        errors.push('Password must contain at least one uppercase letter (A-Z).');

    if (!/[a-z]/.test(password))
        errors.push('Password must contain at least one lowercase letter (a-z).');

    if (!/[0-9]/.test(password))
        errors.push('Password must contain at least one number (0-9).');

    if (!/[@#$%!&*()_+\-=\[\]{};':",.<>?]/.test(password))
        errors.push('Password must contain at least one special character (@, #, $, !, etc.).');

    return errors;
};

export const validateRegister = ({
    firstName,
    lastName,
    email,
    password,
    role,
} = {}) => {
    const errors = [];

    if (!firstName || firstName.trim().length < 2)
        errors.push('First name must be at least 2 characters.');

    if (!lastName || lastName.trim().length < 2)
        errors.push('Last name must be at least 2 characters.');

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
        errors.push('A valid email address is required.');

    errors.push(...getPasswordErrors(password));

    // Public registration only allows patient or doctor
    // admin and superadmin are created through controlled routes only
    if (role && !['patient', 'doctor'].includes(role))
        errors.push('Role must be either patient or doctor.');

    return { valid: errors.length === 0, errors };
};

export const validateLogin = ({ email, password } = {}) => {
    const errors = [];

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
        errors.push('A valid email address is required.');

    if (!password)
        errors.push('Password is required.');

    return { valid: errors.length === 0, errors };
};

// export const validatePasswordChange = ({
//     currentPassword,
//     newPassword,
// } = {}) => {
//     const errors = [];

//     if (!currentPassword)
//         errors.push('Current password is required.');

//     if (!newPassword || newPassword.length < 8)
//         errors.push('New password must be at least 8 characters.');

//     if (
//         currentPassword &&
//         newPassword &&
//         currentPassword === newPassword
//     )
//         errors.push('New password must differ from current password.');

//     return { valid: errors.length === 0, errors };
// };

export const validateCreateAdmin = ({
    firstName,
    lastName,
    email,
    password,
} = {}) => {
    const errors = [];

    if (!firstName || firstName.trim().length < 2)
        errors.push('First name must be at least 2 characters.');

    if (!lastName || lastName.trim().length < 2)
        errors.push('Last name must be at least 2 characters.');

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
        errors.push('A valid email address is required.');

    errors.push(...getPasswordErrors(password));

    return { valid: errors.length === 0, errors };
};