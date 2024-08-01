import axios, { InternalAxiosRequestConfig } from "axios";
import Router from "next/router";

const $api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});


$api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.headers) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Router.push("/");
        }
        return Promise.reject(error.response);
    }
);

export default $api;