interface LoginForm {
    username: string;
    password: string;
    persist?: boolean;
}

interface LoginFormErrors {
    username: string;
    password: string;
}

interface SignupForm {
    fullname: string;
    username: string;
    email: string;
    password: string;
}

interface SignupFormErrors {
    fullname: string;
    username: string;
    email: string;
    password: string;
    userExists: boolean;
}

export function validateLoginForm(form: LoginForm): LoginFormErrors {
    const errors: LoginFormErrors = { username: '', password: '' };
    if (!form.username.trim()) {
        errors.username = '*Username is required';
    }
    if (!form.password.trim()) {
        errors.password = '*Password is required';
    }
    return errors;
}

export function validateSignupForm(form: SignupForm): SignupFormErrors {
    const errors: SignupFormErrors = { fullname: '', username: '', email: '', password: '', userExists: false };
  
    if (!form.fullname.trim()) {
        errors.fullname = '*Full name is required';
    }
    if (!form.username.trim()) {
        errors.username = '*Username is required';
    }
    if (!form.password.trim()) {
        errors.password = '*Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(form.password)) {
        errors.password = '*Password must contain an uppercase letter, a number, a special character, and be at least 8 characters long';
    }
    if (!form.email.trim()) {
        errors.email = '*Email is required';
    } else if (!/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/i.test(form.email)) {
        errors.email = '*Invalid email address';
    }
  
    return errors;
}
