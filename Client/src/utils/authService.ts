import axiosInstance from './axiosInstance';

interface LoginData {
    username: string;
    password: string;
    persist?: boolean;
}

interface SignupData {
    username: string;
    password: string;
    fullname: string;
    email: string;
}

export async function loginUser(data: LoginData) {
    const response = await axiosInstance.post('/user/login', data);
    return response.data;
}

export async function registerUser(data: SignupData) {
    const response = await axiosInstance.post('/user/register', data);
    return response.data;
}
