import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { authClient } from '@/lib/auth/client';

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
};
const service = axios.create(axiosConfig);

// 请求拦截器
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = (await authClient.getUser()).data?.toekn;
    if (token) config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 获取错误码
    const code = response.data.code || 200;
    // code 的取值根据后台返回为准
    // console.log('code', response.data);
    switch (code) {
      case 400:
        return Promise.reject(response.data.msg);
      // case RESPONSE_CODE.Unauthorized:
      //   console.log('登录过期');
      //   break;
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        // f7.dialog.close();
        // f7.dialog.alert('登录已过期，请重新登录', '登录过期', () => {
        //   // 清除 token 及 用户信息
        //   removeAllCookie();
        //   location.reload();
        //   return false;
        // });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
