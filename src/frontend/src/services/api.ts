import axios, { AxiosInstance } from 'axios';

// Backend service URLs (direct connection, bypassing API Gateway for now)
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:5001';
const ACCOUNT_SERVICE_URL = process.env.REACT_APP_ACCOUNT_SERVICE_URL || 'http://localhost:5002';
const TRANSACTION_SERVICE_URL = process.env.REACT_APP_TRANSACTION_SERVICE_URL || 'http://localhost:5003';

// Create axios instances for each service
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
};

// Create clients for each service
const authClient = createApiClient(AUTH_SERVICE_URL);
const accountClient = createApiClient(ACCOUNT_SERVICE_URL);
const transactionClient = createApiClient(TRANSACTION_SERVICE_URL);

export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; phoneNumber: string }) =>
    authClient.post('/api/Auth/register', data),
  login: (data: { email: string; password: string }) =>
    authClient.post('/api/Auth/login', data),
};

export const accountApi = {
  createAccount: (data: { accountType: string; currency: string }) =>
    accountClient.post('/api/Account', data),
  getAccount: (id: string) =>
    accountClient.get(`/api/Account/${id}`),
  getUserAccounts: (userId: string) =>
    accountClient.get(`/api/Account/user/${userId}`),
};

export const transactionApi = {
  transfer: (data: { fromAccountId: string; toAccountId: string; amount: number; currency: string; description?: string }) =>
    transactionClient.post('/api/Transaction/transfer', data),
  getTransaction: (id: string) =>
    transactionClient.get(`/api/Transaction/${id}`),
  getAccountTransactions: (accountId: string) =>
    transactionClient.get(`/api/Transaction/account/${accountId}`),
};

// Default export (auth client for backward compatibility)
export default authClient;


